// Plain literal colors here (not the CSS custom properties in
// src/styles/global.css) — email clients strip <style> blocks and
// external stylesheets unreliably, so every rule below is inlined, and a
// var(--accent) would just fail silently in most inboxes.
const INK = '#0b0e14';
const PAPER = '#f5f1e6';
const ACCENT = '#22c55e';
const MUTED = '#8a93a6';

function shell(bodyHtml: string): string {
	return `<!doctype html>
<html lang="uk">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0; padding:0; background:#f2f0eb; font-family: Arial, Helvetica, sans-serif;">
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0eb; padding: 32px 16px;">
		<tr>
			<td align="center">
				<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden;">
					<tr>
						<td style="background: ${INK}; padding: 24px 32px;">
							<span style="font-family: Arial, sans-serif; font-weight: 800; font-size: 20px; color: ${PAPER};">intech<span style="color: ${ACCENT};">.org.ua</span></span>
						</td>
					</tr>
					<tr>
						<td style="padding: 32px; color: #1c2230; font-size: 15px; line-height: 1.6;">
							${bodyHtml}
						</td>
					</tr>
					<tr>
						<td style="padding: 20px 32px; border-top: 1px solid #eee; color: ${MUTED}; font-size: 12px;">
							intech.org.ua · Полтава, Україна
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
}

function button(label: string, url: string): string {
	return `<a href="${url}" style="display:inline-block; margin-top: 8px; background: ${ACCENT}; color: ${INK}; text-decoration: none; font-weight: 700; padding: 12px 22px; border-radius: 8px; font-size: 14px;">${label}</a>`;
}

export function welcomeEmailTemplate(opts: { name: string; email: string; password: string; loginUrl: string }): {
	subject: string;
	html: string;
} {
	const html = shell(`
		<p style="margin: 0 0 16px;">Вітаємо, ${escapeHtml(opts.name)}!</p>
		<p style="margin: 0 0 16px;">Для вас створено акаунт у клієнтському кабінеті intech.org.ua — там ви бачите статус проекту, файли та можете створювати тікети в підтримку.</p>
		<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 20px 0; width: 100%; background: #f6f5f1; border-radius: 8px;">
			<tr><td style="padding: 14px 18px; font-size: 14px;"><strong>Email:</strong> ${escapeHtml(opts.email)}</td></tr>
			<tr><td style="padding: 0 18px 14px; font-size: 14px;"><strong>Тимчасовий пароль:</strong> ${escapeHtml(opts.password)}</td></tr>
		</table>
		<p style="margin: 0 0 8px; color: ${MUTED}; font-size: 13px;">Радимо змінити пароль після першого входу.</p>
		${button('Увійти в кабінет', opts.loginUrl)}
	`);
	return { subject: 'Доступ до вашого кабінету на intech.org.ua', html };
}

export function newTicketEmailTemplate(opts: {
	recipientName: string;
	ticketNumber: string;
	subject: string;
	projectName: string;
	url: string;
}): { subject: string; html: string } {
	const html = shell(`
		<p style="margin: 0 0 16px;">${escapeHtml(opts.recipientName)}, новий тікет від клієнта:</p>
		<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 20px; width: 100%; background: #f6f5f1; border-radius: 8px;">
			<tr><td style="padding: 14px 18px 4px; font-size: 14px;"><strong>${escapeHtml(opts.ticketNumber)}</strong> — ${escapeHtml(opts.subject)}</td></tr>
			<tr><td style="padding: 0 18px 14px; font-size: 13px; color: ${MUTED};">Проект: ${escapeHtml(opts.projectName)}</td></tr>
		</table>
		${button('Відкрити тікет', opts.url)}
	`);
	return { subject: `Новий тікет ${opts.ticketNumber}: ${opts.subject}`, html };
}

/**
 * Free-form message an admin composes and sends directly to a client — the
 * "Лист клієнту" tab on a ticket. Unlike the fixed templates above, the
 * body is whatever the admin typed (plain text, one line = one paragraph),
 * so it's escaped and paragraph-wrapped here rather than being its own
 * bespoke layout.
 */
export function directMessageEmailTemplate(opts: { recipientName: string; bodyText: string; senderName: string }): {
	html: string;
} {
	const paragraphs = opts.bodyText
		.split('\n\n')
		.map((p) => `<p style="margin: 0 0 14px;">${escapeHtml(p).replace(/\n/g, '<br />')}</p>`)
		.join('');
	const html = shell(`
		<p style="margin: 0 0 16px;">Вітаємо, ${escapeHtml(opts.recipientName)}!</p>
		${paragraphs}
		<p style="margin: 20px 0 0; color: ${MUTED}; font-size: 13px;">— ${escapeHtml(opts.senderName)}, intech.org.ua</p>
	`);
	return { html };
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
