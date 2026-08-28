import type { APIRoute } from 'astro';
import { eq, sql, inArray } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { tickets, ticketMessages, ticketAttachments, users, projects } from '../../../../db/schema';
import { canAccessTicket } from '../../../../lib/tickets';
import { saveAttachment } from '../../../../lib/uploads';
import { sendMail } from '../../../../lib/mailer';
import { newTicketEmailTemplate } from '../../../../lib/emailTemplates';
import { formatTicketNumber } from '../../../../lib/ticketNumber';

export const POST: APIRoute = async ({ request, params, locals, redirect, url }) => {
	const user = locals.user;
	if (!user) return new Response('Unauthorized', { status: 401 });

	const ticketId = Number(params.id);
	const base = user.role === 'admin' ? '/app/admin' : '/app/client';

	if (!canAccessTicket(user, ticketId)) {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const body = String(formData.get('body') || '').trim();
	// Only an admin's own checkbox can mark a message internal — clients can
	// never post one, whatever a tampered form might send.
	const internal = user.role === 'admin' && formData.get('internal') === '1';

	if (!body) {
		return redirect(`${base}/tickets/${ticketId}?error=empty`);
	}

	const message = db
		.insert(ticketMessages)
		.values({ ticketId, authorId: user.id, body, visibility: internal ? 'internal' : 'public' })
		.run();

	const file = formData.get('attachment');
	if (file instanceof File && file.size > 0) {
		try {
			const saved = await saveAttachment(ticketId, file);
			if (saved) {
				db.insert(ticketAttachments)
					.values({ messageId: Number(message.lastInsertRowid), ...saved })
					.run();
			}
		} catch {
			// Attachment failed — the message itself was still posted.
		}
	}

	// An internal note doesn't change the ticket's client-facing status.
	if (!internal) {
		db.update(tickets)
			.set({ updatedAt: sql`(current_timestamp)`, status: user.role === 'admin' ? 'in_progress' : 'open' })
			.where(eq(tickets.id, ticketId))
			.run();
	}

	if (user.role === 'client') {
		notifyAgentsOfReply({ ticketId, origin: url }).catch(() => {});
	}

	return redirect(`${base}/tickets/${ticketId}`);
};

/** Same "every admin/staff gets their own email" behavior as a brand-new ticket. */
async function notifyAgentsOfReply(opts: { ticketId: number; origin: URL }) {
	const ticket = db
		.select({ category: tickets.category, number: tickets.number, subject: tickets.subject, projectId: tickets.projectId })
		.from(tickets)
		.where(eq(tickets.id, opts.ticketId))
		.get();
	if (!ticket) return;

	const project = db.select({ name: projects.name }).from(projects).where(eq(projects.id, ticket.projectId)).get();
	const agents = db.select().from(users).where(inArray(users.role, ['admin', 'staff'])).all();
	const ticketNumber = formatTicketNumber(ticket.category, ticket.number);

	for (const agent of agents) {
		const path = agent.role === 'admin' ? `/app/admin/tickets/${opts.ticketId}` : '/app/staff';
		const { subject, html } = newTicketEmailTemplate({
			recipientName: agent.name,
			ticketNumber,
			subject: `Відповідь клієнта: ${ticket.subject}`,
			projectName: project?.name ?? '—',
			url: new URL(path, opts.origin).toString(),
		});
		await sendMail({ to: agent.email, subject, html });
	}
}
