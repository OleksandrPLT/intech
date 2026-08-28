import type { APIRoute } from 'astro';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { portfolioItems, portfolioItemTranslations } from '../../../../db/schema';
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
		db.delete(portfolioItemTranslations).where(eq(portfolioItemTranslations.itemId, id)).run();
		db.delete(portfolioItems).where(eq(portfolioItems.id, id)).run();
		return redirect('/app/admin/content/portfolio');
	}

	const url = String(formData.get('url') || '').trim();
	const tags = String(formData.get('tags') || '').trim();

	if (!url) {
		return redirect(`/app/admin/content/portfolio/${id}?error=invalid`);
	}

	const existing = db.select().from(portfolioItems).where(eq(portfolioItems.id, id)).get();
	if (!existing) return new Response('Not found', { status: 404 });

	let logo = existing.logo;
	try {
		const uploaded = await saveContentImage(formData.get('logo') as File | null);
		if (uploaded) logo = uploaded;
	} catch {
		return redirect(`/app/admin/content/portfolio/${id}?error=image`);
	}

	db.update(portfolioItems)
		.set({ url, tags: tags || null, logo })
		.where(eq(portfolioItems.id, id))
		.run();

	for (const lang of LANGS) {
		db.update(portfolioItemTranslations)
			.set({
				title: String(formData.get(`title_${lang}`) || ''),
				description: String(formData.get(`description_${lang}`) || ''),
			})
			.where(and(eq(portfolioItemTranslations.itemId, id), eq(portfolioItemTranslations.lang, lang)))
			.run();
	}

	return redirect(`/app/admin/content/portfolio/${id}?saved=1`);
};
