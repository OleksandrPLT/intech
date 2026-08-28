import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { portfolioItems, portfolioItemTranslations } from '../../../db/schema';
import { saveContentImage } from '../../../lib/uploads';

const LANGS = ['uk', 'en', 'et'] as const;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const url = String(formData.get('url') || '').trim();
	const tags = String(formData.get('tags') || '').trim();

	if (!url) {
		return redirect('/app/admin/content/portfolio?error=invalid');
	}

	let logo: string | null = null;
	try {
		logo = await saveContentImage(formData.get('logo') as File | null);
	} catch {
		return redirect('/app/admin/content/portfolio?error=image');
	}

	const result = db
		.insert(portfolioItems)
		.values({ url, tags: tags || null, logo })
		.run();
	const itemId = Number(result.lastInsertRowid);

	for (const lang of LANGS) {
		db.insert(portfolioItemTranslations)
			.values({
				itemId,
				lang,
				title: String(formData.get(`title_${lang}`) || ''),
				description: String(formData.get(`description_${lang}`) || ''),
			})
			.run();
	}

	return redirect('/app/admin/content/portfolio');
};
