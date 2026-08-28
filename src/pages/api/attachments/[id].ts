import type { APIRoute } from 'astro';
import fs from 'node:fs';
import { eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { ticketAttachments, ticketMessages, tickets } from '../../../db/schema';
import { canAccessTicket } from '../../../lib/tickets';
import { resolveApiKey } from '../../../lib/apiKeys';
import { attachmentAbsolutePath } from '../../../lib/uploads';

export const GET: APIRoute = async ({ params, locals, request }) => {
	const id = Number(params.id);
	const attachment = db.select().from(ticketAttachments).where(eq(ticketAttachments.id, id)).get();
	if (!attachment) return new Response('Not found', { status: 404 });

	const message = db.select().from(ticketMessages).where(eq(ticketMessages.id, attachment.messageId)).get();
	if (!message) return new Response('Not found', { status: 404 });

	// A client (session or API key) can never fetch a file attached to an internal-only note.
	const user = locals.user;
	if (user) {
		if (message.visibility === 'internal' && user.role !== 'admin') {
			return new Response('Forbidden', { status: 403 });
		}
		if (!canAccessTicket(user, message.ticketId)) {
			return new Response('Forbidden', { status: 403 });
		}
	} else {
		const apiProjectId = resolveApiKey(request.headers.get('Authorization'));
		const ticket = db.select().from(tickets).where(eq(tickets.id, message.ticketId)).get();
		if (message.visibility === 'internal' || !ticket || apiProjectId !== ticket.projectId) {
			return new Response('Forbidden', { status: 403 });
		}
	}

	const fullPath = attachmentAbsolutePath(attachment.storedPath);
	if (!fs.existsSync(fullPath)) return new Response('Not found', { status: 404 });

	const bytes = fs.readFileSync(fullPath);
	return new Response(bytes, {
		headers: {
			'Content-Type': attachment.mimeType,
			'Content-Disposition': `attachment; filename="${encodeURIComponent(attachment.filename)}"`,
			'Content-Length': String(attachment.size),
			'Cache-Control': 'private, max-age=0, no-cache',
		},
	});
};
