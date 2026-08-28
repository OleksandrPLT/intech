import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { newsPosts, newsPostTranslations } from '../../../db/schema';
import { saveContentImage } from '../../../lib/uploads';

const LANGS = ['uk', 'en', 'et'] as const;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const slug = String(formData.get('slug') || '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, '-')
		.replace(/^-+|-+$/g, '');
	const date = String(formData.get('date') || '').trim();
	const icon = String(formData.get('icon') || '').trim();

	if (!slug || !date) {
		return redirect('/app/admin/content/news?error=invalid');
	}

	let image: string | null = null;
	try {
		image = await saveContentImage(formData.get('image') as File | null);
	} catch (err) {
		return redirect('/app/admin/content/news?error=image');
	}

	const result = db
		.insert(newsPosts)
		.values({ slug, date, icon: icon || null, image })
		.run();
	const postId = Number(result.lastInsertRowid);

	for (const lang of LANGS) {
		db.insert(newsPostTranslations)
			.values({
				postId,
				lang,
				title: String(formData.get(`title_${lang}`) || ''),
				excerpt: String(formData.get(`excerpt_${lang}`) || ''),
				body: String(formData.get(`body_${lang}`) || ''),
				metaTitle: String(formData.get(`metaTitle_${lang}`) || '').trim() || null,
				metaDescription: String(formData.get(`metaDescription_${lang}`) || '').trim() || null,
			})
			.run();
	}

	return redirect('/app/admin/content/news');
};
