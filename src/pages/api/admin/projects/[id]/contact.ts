import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db/client';
import { projects } from '../../../../../db/schema';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const projectId = Number(params.id);
	const formData = await request.formData();
	const contactType = formData.get('contactType') === 'legal' ? 'legal' : 'individual';

	const field = (name: string) => String(formData.get(name) || '').trim() || null;

	db.update(projects)
		.set({
			contactType,
			contactFullName: field('contactFullName'),
			contactPhone: field('contactPhone'),
			contactEmail: field('contactEmail'),
			contactAddress: field('contactAddress'),
			contactCity: field('contactCity'),
			contactCompanyName: field('contactCompanyName'),
			contactTaxId: field('contactTaxId'),
			contactLegalAddress: field('contactLegalAddress'),
			contactDirectorName: field('contactDirectorName'),
			contactDirectorPhone: field('contactDirectorPhone'),
			contactDirectorEmail: field('contactDirectorEmail'),
		})
		.where(eq(projects.id, projectId))
		.run();

	return redirect(`/app/admin/projects/${projectId}?saved=1#contact`);
};
