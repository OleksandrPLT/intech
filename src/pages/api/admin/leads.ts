import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { leads } from '../../../db/schema';
import { saveFieldValues } from '../../../lib/customFields';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const name = String(formData.get('name') || '').trim();
	const contact = String(formData.get('contact') || '').trim();
	const source = String(formData.get('source') || '').trim();

	if (!name) {
		return redirect('/app/admin/leads?error=invalid');
	}

	const result = db
		.insert(leads)
		.values({ name, contact: contact || null, source: source || null })
		.run();

	saveFieldValues('lead', Number(result.lastInsertRowid), formData);

	return redirect('/app/admin/leads');
};
