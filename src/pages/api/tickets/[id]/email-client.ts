import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { tickets, projects, users } from '../../../../db/schema';
import { sendMail } from '../../../../lib/mailer';
import { directMessageEmailTemplate } from '../../../../lib/emailTemplates';
import { logEvent } from '../../../../lib/ticketApprovals';

// Admin-only, direct free-form email to the ticket's client — separate
// from an in-thread reply (which the client sees only by logging into the
// cabinet). Recipient is the project's client account, the canonical
// "who's the customer here" — not necessarily whoever opened the ticket
// (an admin/staff can open one on a client's behalf).
export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const ticketId = Number(params.id);
	const ticket = db.select().from(tickets).where(eq(tickets.id, ticketId)).get();
	if (!ticket) return new Response('Not found', { status: 404 });

	const project = db.select().from(projects).where(eq(projects.id, ticket.projectId)).get();
	const client = project ? db.select().from(users).where(eq(users.id, project.clientId)).get() : null;

	if (!client) {
		return redirect(`/app/admin/tickets/${ticketId}?error=noclient&tab=email`);
	}

	const formData = await request.formData();
	const subject = String(formData.get('subject') || '').trim();
	const body = String(formData.get('body') || '').trim();

	if (!subject || !body) {
		return redirect(`/app/admin/tickets/${ticketId}?error=email&tab=email`);
	}

	const { html } = directMessageEmailTemplate({ recipientName: client.name, bodyText: body, senderName: locals.user.name });
	const result = await sendMail({ to: client.email, subject, html });

	logEvent({
		ticketId,
		actorId: locals.user.id,
		type: 'email_sent',
		toValue: subject,
		note: result.ok ? null : `не надіслано: ${result.error}`,
	});

	return redirect(`/app/admin/tickets/${ticketId}?emailSent=${result.ok ? '1' : '0'}&tab=email`);
};
