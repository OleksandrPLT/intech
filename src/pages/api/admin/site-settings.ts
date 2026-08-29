import type { APIRoute } from 'astro';
import { setSiteSetting } from '../../../lib/siteSettings';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const email = String(formData.get('email') || '').trim();
	const telegram = String(formData.get('telegram') || '').trim();
	const phoneUa = String(formData.get('phoneUa') || '').trim();
	const phoneEe = String(formData.get('phoneEe') || '').trim();

	if (email) setSiteSetting('contact.email', email);
	if (telegram) setSiteSetting('contact.telegram', telegram);
	if (phoneUa) setSiteSetting('contact.phoneUa', phoneUa);
	if (phoneEe) setSiteSetting('contact.phoneEe', phoneEe);

	return redirect('/app/admin/settings/site?saved=1');
};
