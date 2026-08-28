import type { APIRoute } from 'astro';
import { recordLedgerEntry } from '../../../../../lib/payments';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const projectId = Number(params.id);
	const formData = await request.formData();
	const amount = String(formData.get('amount') || '').trim();
	const type = formData.get('type') === 'expense' ? 'expense' : 'income';
	const currency = String(formData.get('currency') || 'UAH');
	const note = String(formData.get('note') || '').trim();
	const paidAt = String(formData.get('paidAt') || '').trim();

	if (!projectId || !amount || Number.isNaN(Number(amount.replace(',', '.')))) {
		return redirect(`/app/admin/projects/${projectId}?error=payment#finance`);
	}

	const receipt = formData.get('receipt');
	const taskIds = formData.getAll('taskIds').map(Number).filter((n) => !Number.isNaN(n));
	await recordLedgerEntry({
		projectId,
		type,
		amount,
		currency,
		note: note || null,
		paidAt: paidAt || null,
		taskIds,
		receipt: receipt instanceof File ? receipt : null,
		recordedBy: locals.user.id,
	});

	return redirect(`/app/admin/projects/${projectId}#finance`);
};
