import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { customFieldDefs } from '../../../db/schema';

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '')
		.slice(0, 60);
}

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const entity = String(formData.get('entity') || '') as 'lead' | 'project' | 'client';
	const label = String(formData.get('label') || '').trim();
	const type = String(formData.get('type') || 'text') as
		| 'text'
		| 'textarea'
		| 'number'
		| 'date'
		| 'select'
		| 'boolean';
	const options = String(formData.get('options') || '').trim();
	const required = formData.get('required') === '1';
	const sortOrder = Number(formData.get('sortOrder') || 0);

	if (!label || !['lead', 'project', 'client'].includes(entity)) {
		return redirect('/app/admin/settings/fields?error=invalid');
	}

	const key = slugify(label) || `field_${Date.now()}`;

	db.insert(customFieldDefs)
		.values({ entity, key, label, type, options: options || null, required, sortOrder })
		.run();

	return redirect('/app/admin/settings/fields');
};
