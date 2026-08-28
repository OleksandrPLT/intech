import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { tickets } from '../db/schema';

/** Next per-category sequence number — VPN#00001, VPN#00002, CRM#00001, ... */
export function nextTicketNumber(category: string): number {
	const row = db
		.select({ max: sql<number>`coalesce(max(${tickets.number}), 0)` })
		.from(tickets)
		.where(eq(tickets.category, category))
		.get();
	return (row?.max ?? 0) + 1;
}

export function formatTicketNumber(category: string, number: number): string {
	return `${category}#${String(number).padStart(5, '0')}`;
}
