import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { users } from '../../../../db/schema';
import { saveFieldValues } from '../../../../lib/customFields';
import { extractProfileFields } from '../../../../lib/clientProfile';

export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.id);
	const formData = await request.formData();
	const name = String(formData.get('name') || '').trim();
	const email = String(formData.get('email') || '')
		.trim()
		.toLowerCase();

	if (!name || !email || Number.isNaN(id)) {
		return redirect(`/app/admin/clients/${params.id}?error=invalid`);
	}

	db.update(users)
		.set({ name, email, ...extractProfileFields(formData) })
		.where(eq(users.id, id))
		.run();
	saveFieldValues('client', id, formData);

	return redirect(`/app/admin/clients/${id}?saved=1`);
};
