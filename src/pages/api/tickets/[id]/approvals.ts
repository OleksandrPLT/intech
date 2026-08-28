import type { APIRoute } from 'astro';
import { db } from '../../../../db/client';
import { ticketApprovals } from '../../../../db/schema';
import { canAccessTicket } from '../../../../lib/tickets';
import { logEvent } from '../../../../lib/ticketApprovals';

// Either side of a ticket can open a "Погодження" request — an admin/staff
// asking the client to sign off on something, or a client asking to have
// something confirmed — without it turning into an open-ended reply.
export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	const user = locals.user;
	if (!user) return new Response('Unauthorized', { status: 401 });

	const ticketId = Number(params.id);
	if (!canAccessTicket(user, ticketId)) {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const title = String(formData.get('title') || '').trim();
	const note = String(formData.get('note') || '').trim();
	const base = user.role === 'admin' ? '/app/admin' : '/app/client';

	if (!title) {
		return redirect(`${base}/tickets/${ticketId}?error=approval&tab=approvals`);
	}

	db.insert(ticketApprovals)
		.values({ ticketId, requestedBy: user.id, title, note: note || null })
		.run();

	logEvent({ ticketId, actorId: user.id, type: 'approval_requested', toValue: title });

	return redirect(`${base}/tickets/${ticketId}?tab=approvals`);
};
