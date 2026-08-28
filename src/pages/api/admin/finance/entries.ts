import type { APIRoute } from 'astro';
import { recordLedgerEntry } from '../../../../lib/payments';

// Same insert as the per-project quick-add form (api/admin/projects/[id]/payments.ts)
// — this one's for the central /app/admin/finance ledger, where the
// project is picked from a <select> rather than baked into the URL.
export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const projectId = Number(formData.get('projectId'));
	const amount = String(formData.get('amount') || '').trim();
	const type = formData.get('type') === 'expense' ? 'expense' : 'income';
	const currency = String(formData.get('currency') || 'UAH');
	const note = String(formData.get('note') || '').trim();
	const paidAt = String(formData.get('paidAt') || '').trim();

	if (!projectId || !amount || Number.isNaN(Number(amount.replace(',', '.')))) {
		return redirect('/app/admin/finance?error=payment');
	}

	const receipt = formData.get('receipt');
	await recordLedgerEntry({
		projectId,
		type,
		amount,
		currency,
		note: note || null,
		paidAt: paidAt || null,
		// No task checklist here — the project isn't known until this form is
		// submitted (it's picked from a <select>), unlike the per-project
		// quick-add form which already has that project's task list on hand.
		taskIds: [],
		receipt: receipt instanceof File ? receipt : null,
		recordedBy: locals.user.id,
	});

	return redirect('/app/admin/finance?saved=1');
};
