import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { ticketApprovals } from '../../../../db/schema';
import { canAccessTicket } from '../../../../lib/tickets';
import { logEvent } from '../../../../lib/ticketApprovals';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	const user = locals.user;
	if (!user) return new Response('Unauthorized', { status: 401 });

	const id = Number(params.id);
	const approval = db.select().from(ticketApprovals).where(eq(ticketApprovals.id, id)).get();
	if (!approval) return new Response('Not found', { status: 404 });

	if (!canAccessTicket(user, approval.ticketId)) {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const decision = String(formData.get('decision') || '');
	const comment = String(formData.get('comment') || '').trim();

	if (decision !== 'approved' && decision !== 'rejected') {
		return new Response('Invalid decision', { status: 400 });
	}

	db.update(ticketApprovals)
		.set({ status: decision, decidedBy: user.id, decidedNote: comment || null, decidedAt: new Date().toISOString() })
		.where(eq(ticketApprovals.id, id))
		.run();

	logEvent({
		ticketId: approval.ticketId,
		actorId: user.id,
		type: 'approval_decided',
		fromValue: approval.title,
		toValue: decision,
	});

	const base = user.role === 'admin' ? '/app/admin' : '/app/client';
	return redirect(`${base}/tickets/${approval.ticketId}?tab=approvals`);
};
