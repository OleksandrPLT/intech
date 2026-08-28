import type { APIRoute } from 'astro';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { tickets } from '../../../../db/schema';
import { ticketStatusLabels } from '../../../../lib/labels';
import { logEvent } from '../../../../lib/ticketApprovals';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const ticketId = Number(params.id);
	const formData = await request.formData();
	const status = String(formData.get('status') || 'open') as
		| 'open'
		| 'in_progress'
		| 'resolved'
		| 'closed';

	const existing = db.select({ status: tickets.status }).from(tickets).where(eq(tickets.id, ticketId)).get();

	db.update(tickets)
		.set({ status, updatedAt: sql`(current_timestamp)` })
		.where(eq(tickets.id, ticketId))
		.run();

	if (existing && existing.status !== status) {
		logEvent({
			ticketId,
			actorId: locals.user.id,
			type: 'status_change',
			fromValue: ticketStatusLabels[existing.status] ?? existing.status,
			toValue: ticketStatusLabels[status] ?? status,
		});
	}

	return redirect(`/app/admin/tickets/${ticketId}`);
};
