import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db/client';
import { invoices } from '../../../../../db/schema';

export const POST: APIRoute = async ({ params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const row = db.select().from(invoices).where(eq(invoices.id, id)).get();
	if (!row) return new Response('Not found', { status: 404 });

	db.delete(invoices).where(eq(invoices.id, id)).run();

	return redirect(`/app/admin/projects/${row.projectId}#invoices`);
};
