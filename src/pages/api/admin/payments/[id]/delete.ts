import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db/client';
import { projectPayments } from '../../../../../db/schema';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const row = db.select().from(projectPayments).where(eq(projectPayments.id, id)).get();
	if (!row) return new Response('Not found', { status: 404 });

	db.delete(projectPayments).where(eq(projectPayments.id, id)).run();

	const formData = await request.formData();
	const returnTo = String(formData.get('returnTo') || '');
	if (returnTo === 'finance') {
		return redirect('/app/admin/finance');
	}
	return redirect(`/app/admin/projects/${row.projectId}#finance`);
};
