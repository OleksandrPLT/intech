import type { APIRoute } from 'astro';
import { db } from '../../../../../db/client';
import { projectCredentials } from '../../../../../db/schema';
import { encrypt } from '../../../../../lib/crypto';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const projectId = Number(params.id);
	const formData = await request.formData();
	const label = String(formData.get('label') || '').trim();
	const username = String(formData.get('username') || '').trim();
	const password = String(formData.get('password') || '');
	const notes = String(formData.get('notes') || '').trim();

	if (!projectId || !label || !password) {
		return redirect(`/app/admin/projects/${projectId}?error=credentials`);
	}

	db.insert(projectCredentials)
		.values({
			projectId,
			label,
			username: username || null,
			encryptedPassword: encrypt(password),
			notes: notes || null,
		})
		.run();

	return redirect(`/app/admin/projects/${projectId}#credentials`);
};
