import { db } from '../db/client';
import { projectFiles, projectPayments } from '../db/schema';
import { saveProjectFile } from './uploads';

const CURRENCIES = ['UAH', 'USD', 'EUR'] as const;
type Currency = (typeof CURRENCIES)[number];

/** Shared by both the per-project quick-add form and the central /app/admin/finance ledger form. */
export async function recordLedgerEntry(opts: {
	projectId: number;
	type: 'income' | 'expense';
	amount: string;
	currency: string;
	note: string | null;
	paidAt: string | null;
	taskIds: number[];
	receipt: File | null;
	recordedBy: number;
}): Promise<void> {
	let receiptFileId: number | null = null;
	if (opts.receipt && opts.receipt.size > 0) {
		try {
			const saved = await saveProjectFile(opts.projectId, opts.receipt);
			if (saved) {
				const result = db
					.insert(projectFiles)
					.values({ projectId: opts.projectId, uploadedBy: opts.recordedBy, ...saved })
					.run();
				receiptFileId = Number(result.lastInsertRowid);
			}
		} catch {
			// Receipt upload failed (e.g. too large) — the ledger entry itself still gets saved.
		}
	}

	db.insert(projectPayments)
		.values({
			projectId: opts.projectId,
			type: opts.type,
			amount: opts.amount,
			currency: (CURRENCIES as readonly string[]).includes(opts.currency) ? (opts.currency as Currency) : 'UAH',
			note: opts.note,
			paidAt: opts.paidAt,
			taskIds: opts.taskIds.length > 0 ? opts.taskIds.join(',') : null,
			receiptFileId,
			recordedBy: opts.recordedBy,
		})
		.run();
}

/** Sums entries by currency, income positive / expense negative — a quick net-balance-per-currency view. */
export function netByCurrency(entries: { type: string; amount: string; currency: string }[]): Record<string, number> {
	return entries.reduce<Record<string, number>>((acc, e) => {
		const n = Number(e.amount.replace(',', '.')) || 0;
		const signed = e.type === 'expense' ? -n : n;
		acc[e.currency] = (acc[e.currency] ?? 0) + signed;
		return acc;
	}, {});
}
