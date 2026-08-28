import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db/client';
import { projectCredentials } from '../../../../../db/schema';

export const POST: APIRoute = async ({ params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const row = db.select().from(projectCredentials).where(eq(projectCredentials.id, id)).get();
	if (!row) return new Response('Not found', { status: 404 });

	db.delete(projectCredentials).where(eq(projectCredentials.id, id)).run();

	return redirect(`/app/admin/projects/${row.projectId}#credentials`);
};
