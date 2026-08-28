import { eq, asc, desc } from 'drizzle-orm';
import { db } from '../db/client';
import { ticketApprovals, ticketEvents, users } from '../db/schema';

export const approvalStatusLabels: Record<string, string> = {
	pending: 'Очікує рішення',
	approved: 'Погоджено',
	rejected: 'Відхилено',
};

export function listApprovals(ticketId: number) {
	return db
		.select({
			id: ticketApprovals.id,
			title: ticketApprovals.title,
			note: ticketApprovals.note,
			status: ticketApprovals.status,
			decidedNote: ticketApprovals.decidedNote,
			decidedAt: ticketApprovals.decidedAt,
			createdAt: ticketApprovals.createdAt,
			requestedByName: users.name,
		})
		.from(ticketApprovals)
		.leftJoin(users, eq(ticketApprovals.requestedBy, users.id))
		.where(eq(ticketApprovals.ticketId, ticketId))
		.orderBy(desc(ticketApprovals.createdAt))
		.all();
}

function eventLabel(type: string, fromValue: string | null, toValue: string | null): string {
	if (type === 'status_change') {
		return `Статус змінено${fromValue ? ` з «${fromValue}»` : ''} на «${toValue}»`;
	}
	if (type === 'approval_requested') {
		return `Запит на погодження: «${toValue}»`;
	}
	if (type === 'approval_decided') {
		return `Погодження «${fromValue}» → ${toValue === 'approved' ? 'погоджено' : 'відхилено'}`;
	}
	if (type === 'email_sent') {
		return `Надіслано лист клієнту: «${toValue}»`;
	}
	return type;
}

export function listEvents(ticketId: number) {
	return db
		.select({
			id: ticketEvents.id,
			type: ticketEvents.type,
			fromValue: ticketEvents.fromValue,
			toValue: ticketEvents.toValue,
			note: ticketEvents.note,
			createdAt: ticketEvents.createdAt,
			actorName: users.name,
		})
		.from(ticketEvents)
		.leftJoin(users, eq(ticketEvents.actorId, users.id))
		.where(eq(ticketEvents.ticketId, ticketId))
		.orderBy(asc(ticketEvents.createdAt))
		.all()
		.map((e) => ({ ...e, label: eventLabel(e.type, e.fromValue, e.toValue) }));
}

export function logEvent(opts: {
	ticketId: number;
	actorId: number;
	type: 'status_change' | 'approval_requested' | 'approval_decided';
	fromValue?: string | null;
	toValue?: string | null;
	note?: string | null;
}) {
	db.insert(ticketEvents)
		.values({
			ticketId: opts.ticketId,
			actorId: opts.actorId,
			type: opts.type,
			fromValue: opts.fromValue ?? null,
			toValue: opts.toValue ?? null,
			note: opts.note ?? null,
		})
		.run();
}
