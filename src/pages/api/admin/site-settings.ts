import type { APIRoute } from 'astro';
import { setSiteSetting } from '../../../lib/siteSettings';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const email = String(formData.get('email') || '').trim();
	const telegram = String(formData.get('telegram') || '').trim();

	if (email) setSiteSetting('contact.email', email);
	if (telegram) setSiteSetting('contact.telegram', telegram);

	return redirect('/app/admin/settings/site?saved=1');
};
