import { eq, asc, inArray } from 'drizzle-orm';
import { db } from '../db/client';
import { ticketMessages, ticketAttachments, users } from '../db/schema';

export function getTicketMessages(ticketId: number, opts: { includeInternal: boolean }) {
	const rows = db
		.select({
			id: ticketMessages.id,
			body: ticketMessages.body,
			visibility: ticketMessages.visibility,
			createdAt: ticketMessages.createdAt,
			authorId: users.id,
			authorName: users.name,
			authorRole: users.role,
		})
		.from(ticketMessages)
		.leftJoin(users, eq(ticketMessages.authorId, users.id))
		.where(eq(ticketMessages.ticketId, ticketId))
		.orderBy(asc(ticketMessages.createdAt))
		.all()
		.filter((m) => opts.includeInternal || m.visibility === 'public');

	const messageIds = rows.map((r) => r.id);
	const attachments =
		messageIds.length === 0
			? []
			: db.select().from(ticketAttachments).where(inArray(ticketAttachments.messageId, messageIds)).all();

	return rows.map((m) => ({
		...m,
		authorName: m.authorName ?? 'Видалений користувач',
		authorRole: m.authorRole ?? 'client',
		attachments: attachments
			.filter((a) => a.messageId === m.id)
			.map((a) => ({ id: a.id, filename: a.filename, size: a.size })),
	}));
}
