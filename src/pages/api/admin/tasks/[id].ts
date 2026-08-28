import type { APIRoute } from 'astro';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { tasks } from '../../../../db/schema';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();
	const intent = String(formData.get('intent') || 'update');

	const task = db.select().from(tasks).where(eq(tasks.id, id)).get();
	if (!task) return new Response('Not found', { status: 404 });

	if (intent === 'delete') {
		db.delete(tasks).where(eq(tasks.id, id)).run();
		return redirect(`/app/admin/projects/${task.projectId}`);
	}

	const title = String(formData.get('title') || '').trim();
	const description = String(formData.get('description') || '').trim();
	const status = String(formData.get('status') || 'todo') as 'todo' | 'in_progress' | 'done';
	const assignedToRaw = String(formData.get('assignedTo') || '');
	const assignedTo = assignedToRaw ? Number(assignedToRaw) : null;
	const dueDate = String(formData.get('dueDate') || '').trim();

	if (!title) {
		return redirect(`/app/admin/tasks/${id}?error=invalid`);
	}

	db.update(tasks)
		.set({
			title,
			description: description || null,
			status,
			assignedTo,
			dueDate: dueDate || null,
			updatedAt: sql`(current_timestamp)`,
		})
		.where(eq(tasks.id, id))
		.run();

	return redirect(`/app/admin/projects/${task.projectId}`);
};
