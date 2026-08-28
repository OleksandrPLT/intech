import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { tasks } from '../../../db/schema';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const projectId = Number(formData.get('projectId'));
	const title = String(formData.get('title') || '').trim();
	const assignedToRaw = String(formData.get('assignedTo') || '');
	const assignedTo = assignedToRaw ? Number(assignedToRaw) : null;
	const dueDate = String(formData.get('dueDate') || '').trim();

	if (!projectId || !title) {
		return redirect(`/app/admin/projects/${projectId}?error=task`);
	}

	db.insert(tasks)
		.values({ projectId, title, assignedTo, dueDate: dueDate || null })
		.run();

	return redirect(`/app/admin/projects/${projectId}`);
};
