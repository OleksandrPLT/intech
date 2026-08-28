import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db/client';
import { projectCredentials } from '../../../../../db/schema';
import { decrypt } from '../../../../../lib/crypto';

// Admin-only page area, so this is UI hygiene against shoulder-surfing
// (don't paint every password in the initial HTML), not a security
// boundary in itself — the boundary is the role check below.
export const GET: APIRoute = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const row = db.select().from(projectCredentials).where(eq(projectCredentials.id, id)).get();
	if (!row) return new Response('Not found', { status: 404 });

	return new Response(JSON.stringify({ password: decrypt(row.encryptedPassword) }), {
		headers: { 'Content-Type': 'application/json' },
	});
};
