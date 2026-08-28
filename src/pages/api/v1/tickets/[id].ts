import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { tickets } from '../../../../db/schema';
import { resolveApiKey } from '../../../../lib/apiKeys';
import { getTicketMessages } from '../../../../lib/ticketMessages';
import { formatTicketNumber } from '../../../../lib/ticketNumber';

export const GET: APIRoute = async ({ request, params }) => {
	const projectId = resolveApiKey(request.headers.get('Authorization'));
	if (!projectId) return json({ error: 'unauthorized' }, 401);

	const id = Number(params.id);
	const ticket = db.select().from(tickets).where(eq(tickets.id, id)).get();
	if (!ticket || ticket.projectId !== projectId) {
		return json({ error: 'not found' }, 404);
	}

	// Internal admin notes never leave the CRM via the API.
	const messages = getTicketMessages(id, { includeInternal: false });

	return json({
		id: ticket.id,
		number: formatTicketNumber(ticket.category, ticket.number),
		category: ticket.category,
		subject: ticket.subject,
		status: ticket.status,
		createdAt: ticket.createdAt,
		updatedAt: ticket.updatedAt,
		messages: messages.map((m) => ({
			id: m.id,
			body: m.body,
			authorName: m.authorName,
			authorRole: m.authorRole,
			createdAt: m.createdAt,
			attachments: m.attachments,
		})),
	});
};

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
