import type { APIRoute } from 'astro';
import { createApiKey } from '../../../lib/apiKeys';

export const POST: APIRoute = async ({ request, locals, redirect, cookies }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const projectId = Number(formData.get('projectId'));
	const name = String(formData.get('name') || 'API-ключ').trim();

	if (!projectId) {
		return redirect('/app/admin/api-keys?error=invalid');
	}

	const key = createApiKey(projectId, name || 'API-ключ');

	// Same "shown once, via a short-lived cookie" pattern as the per-project form.
	cookies.set('new_api_key', key, { path: '/app/admin/api-keys', httpOnly: true, maxAge: 30, sameSite: 'lax' });

	return redirect('/app/admin/api-keys');
};
