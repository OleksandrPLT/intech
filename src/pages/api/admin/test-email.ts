import type { APIRoute } from 'astro';
import { sendMail } from '../../../lib/mailer';

export const POST: APIRoute = async ({ locals, redirect }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const result = await sendMail({
		to: locals.user.email,
		subject: 'Тестовий лист з intech.org.ua',
		html: `<p>Якщо ви бачите цей лист у вхідних — SMTP налаштовано правильно.</p><p>Якщо SMTP ще не налаштовано, цей лист збережено як файл у <code>data/emails/</code> замість надсилання.</p>`,
	});

	if (!result.ok) {
		return redirect(`/app/admin/settings/site?test=failed&testError=${encodeURIComponent(result.error)}`);
	}
	return redirect(`/app/admin/settings/site?test=${result.mode}`);
};
