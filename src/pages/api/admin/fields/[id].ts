import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { customFieldDefs, customFieldValues } from '../../../../db/schema';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();
	const intent = String(formData.get('intent') || 'update');

	if (intent === 'delete') {
		db.delete(customFieldValues).where(eq(customFieldValues.fieldId, id)).run();
		db.delete(customFieldDefs).where(eq(customFieldDefs.id, id)).run();
		return redirect('/app/admin/settings/fields');
	}

	const label = String(formData.get('label') || '').trim();
	const options = String(formData.get('options') || '').trim();
	const required = formData.get('required') === '1';
	const sortOrder = Number(formData.get('sortOrder') || 0);

	if (!label) {
		return redirect('/app/admin/settings/fields?error=invalid');
	}

	db.update(customFieldDefs)
		.set({ label, options: options || null, required, sortOrder })
		.where(eq(customFieldDefs.id, id))
		.run();

	return redirect('/app/admin/settings/fields');
};
