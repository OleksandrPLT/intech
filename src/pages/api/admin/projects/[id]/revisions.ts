import type { APIRoute } from 'astro';
import { db } from '../../../../../db/client';
import { projectFiles, projectRevisions } from '../../../../../db/schema';
import { saveProjectFile } from '../../../../../lib/uploads';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const projectId = Number(params.id);
	const formData = await request.formData();
	const title = String(formData.get('title') || '').trim();
	const description = String(formData.get('description') || '').trim();

	if (!projectId || !title) {
		return redirect(`/app/admin/projects/${projectId}?error=revision#revisions`);
	}

	let fileId: number | null = null;
	const file = formData.get('file');
	if (file instanceof File && file.size > 0) {
		try {
			const saved = await saveProjectFile(projectId, file);
			if (saved) {
				const result = db
					.insert(projectFiles)
					.values({ projectId, uploadedBy: locals.user.id, ...saved })
					.run();
				fileId = Number(result.lastInsertRowid);
			}
		} catch {
			// File failed (e.g. too large) — the revision itself still gets posted.
		}
	}

	db.insert(projectRevisions)
		.values({ projectId, createdBy: locals.user.id, title, description: description || null, fileId })
		.run();

	return redirect(`/app/admin/projects/${projectId}#revisions`);
};
