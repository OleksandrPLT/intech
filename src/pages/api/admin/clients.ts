import type { APIRoute } from 'astro';
import { db } from '../../../db/client';
import { users } from '../../../db/schema';
import { hashPassword } from '../../../lib/auth';
import { saveFieldValues } from '../../../lib/customFields';
import { sendMail } from '../../../lib/mailer';
import { welcomeEmailTemplate } from '../../../lib/emailTemplates';
import { extractProfileFields } from '../../../lib/clientProfile';

export const POST: APIRoute = async ({ request, locals, redirect, url }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const formData = await request.formData();
	const name = String(formData.get('name') || '').trim();
	const email = String(formData.get('email') || '')
		.trim()
		.toLowerCase();
	const password = String(formData.get('password') || '');

	if (!name || !email || password.length < 8) {
		return redirect('/app/admin/clients?error=invalid');
	}

	let newId: number;
	try {
		const passwordHash = await hashPassword(password);
		const result = db
			.insert(users)
			.values({ name, email, passwordHash, role: 'client', ...extractProfileFields(formData) })
			.run();
		newId = Number(result.lastInsertRowid);
	} catch {
		return redirect('/app/admin/clients?error=exists');
	}

	saveFieldValues('client', newId, formData);

	const { subject, html } = welcomeEmailTemplate({
		name,
		email,
		password,
		loginUrl: new URL('/login', url).toString(),
	});
	sendMail({ to: email, subject, html }).catch(() => {});

	return redirect(`/app/admin/clients/${newId}`);
};
