import type { APIRoute } from 'astro';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../../../../db/client';
import { tickets, ticketMessages, projects } from '../../../../../db/schema';
import { resolveApiKey } from '../../../../../lib/apiKeys';

export const POST: APIRoute = async ({ request, params }) => {
	const projectId = resolveApiKey(request.headers.get('Authorization'));
	if (!projectId) return json({ error: 'unauthorized' }, 401);

	const id = Number(params.id);
	const ticket = db.select().from(tickets).where(eq(tickets.id, id)).get();
	if (!ticket || ticket.projectId !== projectId) {
		return json({ error: 'not found' }, 404);
	}

	let body: any;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'invalid json body' }, 400);
	}

	const text = String(body?.body || '').trim();
	if (!text) return json({ error: 'body is required' }, 400);

	const project = db.select().from(projects).where(eq(projects.id, projectId)).get()!;

	const message = db
		.insert(ticketMessages)
		.values({ ticketId: id, authorId: project.clientId, body: text })
		.run();

	db.update(tickets)
		.set({ status: 'open', updatedAt: sql`(current_timestamp)` })
		.where(eq(tickets.id, id))
		.run();

	return json({ id: Number(message.lastInsertRowid) }, 201);
};

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
