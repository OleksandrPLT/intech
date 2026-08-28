import type { APIRoute } from 'astro';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { tickets, ticketMessages, projects } from '../../../../db/schema';
import { resolveApiKey } from '../../../../lib/apiKeys';
import { isTicketCategory } from '../../../../lib/ticketCategories';
import { nextTicketNumber, formatTicketNumber } from '../../../../lib/ticketNumber';

export const GET: APIRoute = async ({ request }) => {
	const projectId = resolveApiKey(request.headers.get('Authorization'));
	if (!projectId) return json({ error: 'unauthorized' }, 401);

	const rows = db.select().from(tickets).where(eq(tickets.projectId, projectId)).orderBy(desc(tickets.updatedAt)).all();

	return json({
		tickets: rows.map((t) => ({
			id: t.id,
			number: formatTicketNumber(t.category, t.number),
			category: t.category,
			subject: t.subject,
			status: t.status,
			createdAt: t.createdAt,
			updatedAt: t.updatedAt,
		})),
	});
};

export const POST: APIRoute = async ({ request }) => {
	const projectId = resolveApiKey(request.headers.get('Authorization'));
	if (!projectId) return json({ error: 'unauthorized' }, 401);

	const project = db.select().from(projects).where(eq(projects.id, projectId)).get();
	if (!project) return json({ error: 'project not found' }, 404);

	let body: any;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'invalid json body' }, 400);
	}

	const subject = String(body?.subject || '').trim();
	const message = String(body?.body || '').trim();
	const categoryRaw = String(body?.category || 'GEN');
	const category = isTicketCategory(categoryRaw) ? categoryRaw : 'GEN';

	if (!subject || !message) {
		return json({ error: 'subject and body are required' }, 400);
	}

	const number = nextTicketNumber(category);
	const result = db
		.insert(tickets)
		.values({ projectId, createdBy: project.clientId, subject, category, number })
		.run();
	const ticketId = Number(result.lastInsertRowid);

	db.insert(ticketMessages).values({ ticketId, authorId: project.clientId, body: message }).run();

	return json(
		{
			id: ticketId,
			number: formatTicketNumber(category, number),
			category,
			subject,
			status: 'open',
		},
		201,
	);
};

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
