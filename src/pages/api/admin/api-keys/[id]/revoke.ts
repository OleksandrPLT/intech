import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db/client';
import { apiKeys } from '../../../../../db/schema';
import { revokeApiKey } from '../../../../../lib/apiKeys';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const key = db.select().from(apiKeys).where(eq(apiKeys.id, id)).get();
	if (!key) return new Response('Not found', { status: 404 });

	revokeApiKey(id);

	// Works whether "revoke" was clicked from the project page or the
	// centralized /app/admin/api-keys list — go back to wherever that was.
	const referer = request.headers.get('referer');
	const backTo = referer ? new URL(referer).pathname : `/app/admin/projects/${key.projectId}`;
	return redirect(backTo);
};
