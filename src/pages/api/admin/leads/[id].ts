import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { leads } from '../../../../db/schema';
import { saveFieldValues } from '../../../../lib/customFields';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();
	const name = String(formData.get('name') || '').trim();
	const contact = String(formData.get('contact') || '').trim();
	const source = String(formData.get('source') || '').trim();
	const notes = String(formData.get('notes') || '').trim();
	const stage = String(formData.get('stage') || 'new') as
		| 'new'
		| 'contacted'
		| 'proposal'
		| 'won'
		| 'lost';

	if (!name || Number.isNaN(id)) {
		return redirect(`/app/admin/leads/${params.id}?error=invalid`);
	}

	db.update(leads)
		.set({ name, contact: contact || null, source: source || null, notes: notes || null, stage })
		.where(eq(leads.id, id))
		.run();

	saveFieldValues('lead', id, formData);

	return redirect('/app/admin/leads');
};
