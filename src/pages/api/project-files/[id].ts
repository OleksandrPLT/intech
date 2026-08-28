import type { APIRoute } from 'astro';
import fs from 'node:fs';
import { eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { projectFiles } from '../../../db/schema';
import { canAccessProject } from '../../../lib/tickets';
import { projectFileAbsolutePath } from '../../../lib/uploads';

export const GET: APIRoute = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) return new Response('Unauthorized', { status: 401 });

	const id = Number(params.id);
	const file = db.select().from(projectFiles).where(eq(projectFiles.id, id)).get();
	if (!file) return new Response('Not found', { status: 404 });

	if (!canAccessProject(user, file.projectId)) {
		return new Response('Forbidden', { status: 403 });
	}

	const fullPath = projectFileAbsolutePath(file.storedPath);
	if (!fs.existsSync(fullPath)) return new Response('Not found', { status: 404 });

	const bytes = fs.readFileSync(fullPath);
	return new Response(bytes, {
		headers: {
			'Content-Type': file.mimeType,
			'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
			'Content-Length': String(file.size),
			'Cache-Control': 'private, max-age=0, no-cache',
		},
	});
};
