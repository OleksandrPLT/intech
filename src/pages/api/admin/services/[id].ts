import type { APIRoute } from 'astro';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { serviceTranslations } from '../../../../db/schema';

const LANGS = ['uk', 'en', 'et'] as const;

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();

	for (const lang of LANGS) {
		db.update(serviceTranslations)
			.set({
				title: String(formData.get(`title_${lang}`) || ''),
				summary: String(formData.get(`summary_${lang}`) || ''),
				description: String(formData.get(`description_${lang}`) || ''),
				features: String(formData.get(`features_${lang}`) || ''),
				forWhom: String(formData.get(`forWhom_${lang}`) || ''),
			})
			.where(and(eq(serviceTranslations.serviceId, id), eq(serviceTranslations.lang, lang)))
			.run();
	}

	return redirect(`/app/admin/content/services/${id}?saved=1`);
};
