import type { APIRoute } from 'astro';
import { setSiteSetting } from '../../../lib/siteSettings';
import { encrypt } from '../../../lib/crypto';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const host = String(formData.get('host') || '').trim();
	const port = String(formData.get('port') || '').trim();
	const user = String(formData.get('user') || '').trim();
	const pass = String(formData.get('pass') || '');
	const from = String(formData.get('from') || '').trim();
	const secure = formData.get('secure') === '1';

	setSiteSetting('smtp.host', host);
	setSiteSetting('smtp.port', port || '587');
	setSiteSetting('smtp.user', user);
	setSiteSetting('smtp.from', from);
	setSiteSetting('smtp.secure', secure ? '1' : '0');
	// Blank password field on save = "keep the existing one" (never re-shown
	// in the form) — only overwrite it when something was actually typed.
	if (pass) {
		setSiteSetting('smtp.pass', encrypt(pass));
	}

	return redirect('/app/admin/settings/site?saved=1');
};
