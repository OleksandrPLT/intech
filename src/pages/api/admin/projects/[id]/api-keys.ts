import type { APIRoute } from 'astro';
import { createApiKey } from '../../../../../lib/apiKeys';

export const POST: APIRoute = async ({ request, params, locals, redirect, cookies }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const projectId = Number(params.id);
	const formData = await request.formData();
	const name = String(formData.get('name') || 'API-ключ').trim();

	const key = createApiKey(projectId, name || 'API-ключ');

	// Shown exactly once: passed via a short-lived httpOnly cookie (read once
	// and cleared by the project page) instead of a URL, so it never lands in
	// server logs or browser history.
	cookies.set('new_api_key', key, { path: '/app/admin/projects', httpOnly: true, maxAge: 30, sameSite: 'lax' });

	return redirect(`/app/admin/projects/${projectId}`);
};
