import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { projectFiles } from '../../db/schema';
import { canAccessProject } from '../../lib/tickets';
import { saveProjectFile } from '../../lib/uploads';

// Shared by both the admin project page and the client dashboard — same
// "one endpoint, role only decides where it redirects back to" shape as
// api/tickets.ts.
export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const user = locals.user;
	if (!user) return new Response('Unauthorized', { status: 401 });

	const formData = await request.formData();
	const projectId = Number(formData.get('projectId'));
	const base = user.role === 'admin' ? `/app/admin/projects/${projectId}` : '/app/client';

	if (!projectId || !canAccessProject(user, projectId)) {
		return new Response('Forbidden', { status: 403 });
	}

	const file = formData.get('file');
	if (!(file instanceof File) || file.size === 0) {
		return redirect(`${base}?error=file#files`);
	}

	try {
		const saved = await saveProjectFile(projectId, file);
		if (saved) {
			db.insert(projectFiles)
				.values({ projectId, uploadedBy: user.id, ...saved })
				.run();
		}
	} catch {
		return redirect(`${base}?error=file#files`);
	}

	return redirect(`${base}#files`);
};
