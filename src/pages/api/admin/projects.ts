import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { projects } from '../../../db/schema';
import { saveFieldValues } from '../../../lib/customFields';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const name = String(formData.get('name') || '').trim();
	const clientId = Number(formData.get('clientId'));
	const description = String(formData.get('description') || '').trim();
	const websiteUrl = String(formData.get('websiteUrl') || '').trim();

	if (!name || !clientId) {
		return redirect('/app/admin/projects/new?error=invalid');
	}

	const result = db
		.insert(projects)
		.values({ name, clientId, description: description || null, websiteUrl: websiteUrl || null })
		.run();

	saveFieldValues('project', Number(result.lastInsertRowid), formData);

	return redirect(`/app/admin/projects/${result.lastInsertRowid}`);
};
