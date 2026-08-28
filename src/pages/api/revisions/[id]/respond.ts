import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { projectRevisions } from '../../../../db/schema';
import { canAccessProject } from '../../../../lib/tickets';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	const user = locals.user;
	if (!user) return new Response('Unauthorized', { status: 401 });

	const id = Number(params.id);
	const revision = db.select().from(projectRevisions).where(eq(projectRevisions.id, id)).get();
	if (!revision) return new Response('Not found', { status: 404 });

	if (!canAccessProject(user, revision.projectId)) {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const decision = String(formData.get('decision') || '');
	const comment = String(formData.get('comment') || '').trim();

	if (decision !== 'approved' && decision !== 'changes_requested') {
		return new Response('Invalid decision', { status: 400 });
	}
	if (decision === 'changes_requested' && !comment) {
		const base = user.role === 'admin' ? `/app/admin/projects/${revision.projectId}` : '/app/client';
		return redirect(`${base}?error=comment#revisions`);
	}

	db.update(projectRevisions)
		.set({ status: decision, clientComment: comment || null, respondedAt: new Date().toISOString() })
		.where(eq(projectRevisions.id, id))
		.run();

	const base = user.role === 'admin' ? `/app/admin/projects/${revision.projectId}` : '/app/client';
	return redirect(`${base}#revisions`);
};
