import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { projects } from '../../../../db/schema';
import { saveFieldValues } from '../../../../lib/customFields';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();
	const name = String(formData.get('name') || '').trim();
	const description = String(formData.get('description') || '').trim();
	const websiteUrl = String(formData.get('websiteUrl') || '').trim();
	const status = String(formData.get('status') || 'discovery') as
		| 'discovery'
		| 'in_progress'
		| 'review'
		| 'on_hold'
		| 'done';
	const paymentStatus = String(formData.get('paymentStatus') || 'not_invoiced') as
		| 'not_invoiced'
		| 'invoiced'
		| 'partially_paid'
		| 'paid';

	if (!name || Number.isNaN(id)) {
		return redirect(`/app/admin/projects/${params.id}?error=invalid`);
	}

	db.update(projects)
		.set({ name, description: description || null, websiteUrl: websiteUrl || null, status, paymentStatus })
		.where(eq(projects.id, id))
		.run();

	saveFieldValues('project', id, formData);

	return redirect(`/app/admin/projects/${id}?saved=1`);
};
