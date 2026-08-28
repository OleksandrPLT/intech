import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { newsComments } from '../../../../db/schema';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();
	const intent = String(formData.get('intent') || 'approve');

	if (intent === 'delete') {
		db.delete(newsComments).where(eq(newsComments.id, id)).run();
	} else {
		db.update(newsComments).set({ approved: true }).where(eq(newsComments.id, id)).run();
	}

	return redirect('/app/admin/comments');
};
