import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { newsComments } from '../../../db/schema';
import { getNewsItem } from '../../../data/news';

export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData();
	const referer = request.headers.get('referer') || '/news';
	const backTo = new URL(referer).pathname || '/news';

	// Honeypot — same pattern as the lead form.
	if (String(formData.get('website') || '').trim() !== '') {
		return redirect(`${backTo}?commented=1`);
	}

	const slug = String(formData.get('slug') || '').trim();
	const name = String(formData.get('name') || '').trim();
	const body = String(formData.get('body') || '').trim();

	if (!slug || !getNewsItem(slug) || !name || !body) {
		return redirect(`${backTo}?error=invalid`);
	}

	db.insert(newsComments).values({ slug, name, body }).run();

	return redirect(`${backTo}?commented=1`);
};
