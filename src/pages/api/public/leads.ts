import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { leads } from '../../../db/schema';

/**
 * Public lead-capture form on /contact — no auth required. Submissions land
 * straight in the CRM pipeline (/app/admin/leads) as a 'new' lead, source
 * "Сайт (форма заявки)".
 */
export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData();

	// Honeypot: a real visitor never fills this (it's hidden via CSS); a bot
	// filling every field usually does. Pretend success either way — no need
	// to tip bots off.
	const referer = request.headers.get('referer') || '/contact';
	const backTo = new URL(referer).pathname || '/contact';

	if (String(formData.get('website') || '').trim() !== '') {
		return redirect(`${backTo}?sent=1`);
	}

	const name = String(formData.get('name') || '').trim();
	const contactRaw = String(formData.get('contact') || '').trim();
	const service = String(formData.get('service') || '').trim();
	const message = String(formData.get('message') || '').trim();

	if (!name || !contactRaw) {
		return redirect(`${backTo}?error=invalid`);
	}

	const notesParts = [service && `Послуга: ${service}`, message].filter(Boolean);

	db.insert(leads)
		.values({
			name,
			contact: contactRaw,
			source: 'Сайт (форма заявки)',
			notes: notesParts.join('\n\n') || null,
		})
		.run();

	return redirect(`${backTo}?sent=1`);
};
