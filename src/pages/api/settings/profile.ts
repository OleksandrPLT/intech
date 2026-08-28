import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../../db/client';
import { users } from '../../../db/schema';
import { hashPassword, verifyPassword } from '../../../lib/auth';

// Any logged-in role (admin/staff/client) can edit their own account here —
// this is "my profile", not the admin-only CRM client-profile fields on
// /app/admin/clients/[id] (those stay admin-managed business data).
export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const user = locals.user;
	if (!user) return new Response('Unauthorized', { status: 401 });

	const formData = await request.formData();
	const currentPassword = String(formData.get('currentPassword') || '');
	const name = String(formData.get('name') || '').trim();
	const email = String(formData.get('email') || '').trim().toLowerCase();
	const newPassword = String(formData.get('newPassword') || '');
	const newPasswordConfirm = String(formData.get('newPasswordConfirm') || '');

	if (!name || !email || !currentPassword) {
		return redirect('/app/settings/profile?error=invalid');
	}

	const ok = await verifyPassword(currentPassword, user.passwordHash);
	if (!ok) {
		return redirect('/app/settings/profile?error=password');
	}

	if (newPassword || newPasswordConfirm) {
		if (newPassword.length < 8 || newPassword !== newPasswordConfirm) {
			return redirect('/app/settings/profile?error=newpassword');
		}
	}

	try {
		const update: Partial<typeof users.$inferInsert> = { name, email };
		if (newPassword) {
			update.passwordHash = await hashPassword(newPassword);
		}
		db.update(users).set(update).where(eq(users.id, user.id)).run();
	} catch {
		return redirect('/app/settings/profile?error=exists');
	}

	return redirect('/app/settings/profile?saved=1');
};
