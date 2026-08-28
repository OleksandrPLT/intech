import type { APIRoute } from 'astro';
import { db } from '../../../../../db/client';
import { invoices } from '../../../../../db/schema';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const projectId = Number(params.id);
	const formData = await request.formData();
	const amount = String(formData.get('amount') || '').trim();
	const currency = String(formData.get('currency') || 'UAH');
	const description = String(formData.get('description') || '').trim();
	const issuedAt = String(formData.get('issuedAt') || '').trim();
	const dueDate = String(formData.get('dueDate') || '').trim();

	if (!projectId || !amount || Number.isNaN(Number(amount.replace(',', '.')))) {
		return redirect(`/app/admin/projects/${projectId}?error=invoice#invoices`);
	}

	db.insert(invoices)
		.values({
			projectId,
			amount,
			currency: ['UAH', 'USD', 'EUR'].includes(currency) ? (currency as 'UAH' | 'USD' | 'EUR') : 'UAH',
			description: description || null,
			issuedAt: issuedAt || null,
			dueDate: dueDate || null,
			createdBy: locals.user.id,
		})
		.run();

	return redirect(`/app/admin/projects/${projectId}#invoices`);
};
