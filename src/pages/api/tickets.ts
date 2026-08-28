import type { APIRoute } from 'astro';
import { inArray, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { tickets, ticketMessages, ticketAttachments, users, projects } from '../../db/schema';
import { canAccessProject } from '../../lib/tickets';
import { isTicketCategory } from '../../lib/ticketCategories';
import { nextTicketNumber, formatTicketNumber } from '../../lib/ticketNumber';
import { saveAttachment } from '../../lib/uploads';
import { sendMail } from '../../lib/mailer';
import { newTicketEmailTemplate } from '../../lib/emailTemplates';

export const POST: APIRoute = async ({ request, locals, redirect, url }) => {
	const user = locals.user;
	if (!user) return new Response('Unauthorized', { status: 401 });

	const formData = await request.formData();
	const projectId = Number(formData.get('projectId'));
	const subject = String(formData.get('subject') || '').trim();
	const body = String(formData.get('body') || '').trim();
	const categoryRaw = String(formData.get('category') || 'GEN');
	const category = isTicketCategory(categoryRaw) ? categoryRaw : 'GEN';
	const base = user.role === 'admin' ? '/app/admin' : '/app/client';

	if (!projectId || !subject || !body) {
		return redirect(`${base}/tickets/new?error=invalid`);
	}

	if (!canAccessProject(user, projectId)) {
		return new Response('Forbidden', { status: 403 });
	}

	const number = nextTicketNumber(category);
	const ticket = db.insert(tickets).values({ projectId, createdBy: user.id, subject, category, number }).run();
	const ticketId = Number(ticket.lastInsertRowid);

	const message = db.insert(ticketMessages).values({ ticketId, authorId: user.id, body }).run();

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
			// Attachment failed (e.g. too large) — the ticket itself was still created.
		}
	}

	if (user.role === 'client') {
		notifyAgentsOfNewTicket({ ticketId, category, number, subject, projectId, origin: url }).catch(() => {});
	}

	return redirect(`${base}/tickets/${ticketId}`);
};

/** Every admin/staff account gets its own notification email — not one shared inbox (see the plan's clarified requirement). */
async function notifyAgentsOfNewTicket(opts: {
	ticketId: number;
	category: string;
	number: number;
	subject: string;
	projectId: number;
	origin: URL;
}) {
	const project = db.select({ name: projects.name }).from(projects).where(eq(projects.id, opts.projectId)).get();
	const agents = db.select().from(users).where(inArray(users.role, ['admin', 'staff'])).all();
	const ticketNumber = formatTicketNumber(opts.category, opts.number);

	for (const agent of agents) {
		// Staff has no ticket-detail view yet (only /app/staff's task list) —
		// point them at their dashboard rather than a route that doesn't exist.
		const path = agent.role === 'admin' ? `/app/admin/tickets/${opts.ticketId}` : '/app/staff';
		const { subject, html } = newTicketEmailTemplate({
			recipientName: agent.name,
			ticketNumber,
			subject: opts.subject,
			projectName: project?.name ?? '—',
			url: new URL(path, opts.origin).toString(),
		});
		await sendMail({ to: agent.email, subject, html });
	}
}
