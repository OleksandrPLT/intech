import type { APIRoute } from 'astro';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { newsPosts, newsPostTranslations } from '../../../../db/schema';
import { saveContentImage } from '../../../../lib/uploads';

const LANGS = ['uk', 'en', 'et'] as const;

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();
	const intent = String(formData.get('intent') || 'update');

	if (intent === 'delete') {
		db.delete(newsPostTranslations).where(eq(newsPostTranslations.postId, id)).run();
		db.delete(newsPosts).where(eq(newsPosts.id, id)).run();
		return redirect('/app/admin/content/news');
	}

	const date = String(formData.get('date') || '').trim();
	const icon = String(formData.get('icon') || '').trim();

	if (!date) {
		return redirect(`/app/admin/content/news/${id}?error=invalid`);
	}

	const existing = db.select().from(newsPosts).where(eq(newsPosts.id, id)).get();
	if (!existing) return new Response('Not found', { status: 404 });

	let image = existing.image;
	try {
		const uploaded = await saveContentImage(formData.get('image') as File | null);
		if (uploaded) image = uploaded;
	} catch {
		return redirect(`/app/admin/content/news/${id}?error=image`);
	}

	db.update(newsPosts)
		.set({ date, icon: icon || null, image })
		.where(eq(newsPosts.id, id))
		.run();

	for (const lang of LANGS) {
		db.update(newsPostTranslations)
			.set({
				title: String(formData.get(`title_${lang}`) || ''),
				excerpt: String(formData.get(`excerpt_${lang}`) || ''),
				body: String(formData.get(`body_${lang}`) || ''),
				metaTitle: String(formData.get(`metaTitle_${lang}`) || '').trim() || null,
				metaDescription: String(formData.get(`metaDescription_${lang}`) || '').trim() || null,
			})
			.where(and(eq(newsPostTranslations.postId, id), eq(newsPostTranslations.lang, lang)))
			.run();
	}

	return redirect(`/app/admin/content/news/${id}?saved=1`);
};
