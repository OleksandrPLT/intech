import type { APIRoute } from 'astro';
import { eq, sql, and } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { tasks } from '../../../../db/schema';

/** Staff can only move the status of a task assigned to them — nothing else. */
export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	const user = locals.user;
	if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();
	const status = String(formData.get('status') || 'todo') as 'todo' | 'in_progress' | 'done';

	const task = db.select().from(tasks).where(eq(tasks.id, id)).get();
	if (!task) return new Response('Not found', { status: 404 });
	if (user.role === 'staff' && task.assignedTo !== user.id) {
		return new Response('Forbidden', { status: 403 });
	}

	db.update(tasks)
		.set({ status, updatedAt: sql`(current_timestamp)` })
		.where(eq(tasks.id, id))
		.run();

	return redirect('/app/staff');
};
