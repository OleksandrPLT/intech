import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { getSiteSetting } from './siteSettings';
import { decrypt } from './crypto';

const EMAIL_LOG_DIR = process.env.EMAIL_LOG_DIR || './data/emails';

type SendMailInput = {
	to: string;
	subject: string;
	html: string;
};

type SmtpConfig = {
	host: string;
	port: number;
	secure: boolean;
	user: string;
	pass: string;
	from: string;
};

/**
 * SMTP can be set two ways — through /app/admin/settings/site (stored in
 * site_settings, password encrypted with the same AES-256-GCM helper as the
 * project credentials vault), or via SMTP_* in .env for a zero-UI/ops-only
 * deploy. The in-app setting wins when both are present, since it's the one
 * an admin can change without a redeploy.
 */
function resolveSmtpConfig(): SmtpConfig | null {
	const dbHost = getSiteSetting('smtp.host', '');
	const dbUser = getSiteSetting('smtp.user', '');
	const dbPassEncrypted = getSiteSetting('smtp.pass', '');

	if (dbHost && dbUser && dbPassEncrypted) {
		let pass = '';
		try {
			pass = decrypt(dbPassEncrypted);
		} catch {
			// Encryption key changed since this was saved — treat as unconfigured
			// rather than sending with a garbled password.
			return null;
		}
		return {
			host: dbHost,
			port: Number(getSiteSetting('smtp.port', '587')) || 587,
			secure: getSiteSetting('smtp.secure', '0') === '1',
			user: dbUser,
			pass,
			from: getSiteSetting('smtp.from', dbUser),
		};
	}

	if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
		return {
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT || 587),
			secure: process.env.SMTP_SECURE === '1',
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
			from: process.env.SMTP_FROM || process.env.SMTP_USER,
		};
	}

	return null;
}

function safeSlug(value: string): string {
	return value.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 80);
}

export type SendMailResult = { ok: true; mode: 'sent' | 'logged' } | { ok: false; mode: 'failed'; error: string };

/**
 * Sends an HTML email — or, when SMTP isn't configured (neither in the
 * settings UI nor via env), writes it to data/emails/*.html instead so
 * nothing crashes while the site runs without a mailbox set up yet.
 *
 * Returns a result instead of throwing: background callers (client
 * creation, a ticket reply) just fire-and-forget it, so a bad SMTP
 * password must never break the flow that triggered the email — but the
 * "send test email" button (src/pages/api/admin/test-email.ts) reads the
 * result to tell the admin whether it actually went out.
 */
export async function sendMail({ to, subject, html }: SendMailInput): Promise<SendMailResult> {
	const config = resolveSmtpConfig();

	if (!config) {
		try {
			fs.mkdirSync(EMAIL_LOG_DIR, { recursive: true });
			const file = `${Date.now()}-${safeSlug(to)}.html`;
			fs.writeFileSync(
				path.join(EMAIL_LOG_DIR, file),
				`<!-- To: ${to} -->\n<!-- Subject: ${subject} -->\n${html}`,
			);
			console.log(`[mailer] SMTP not configured — wrote ${path.join(EMAIL_LOG_DIR, file)}`);
			return { ok: true, mode: 'logged' };
		} catch (err) {
			console.error('[mailer] failed to write fallback email file:', err);
			return { ok: false, mode: 'failed', error: err instanceof Error ? err.message : String(err) };
		}
	}

	try {
		const transport = nodemailer.createTransport({
			host: config.host,
			port: config.port,
			secure: config.secure,
			auth: { user: config.user, pass: config.pass },
		});
		await transport.sendMail({ from: config.from, to, subject, html });
		return { ok: true, mode: 'sent' };
	} catch (err) {
		console.error(`[mailer] failed to send to ${to}:`, err);
		return { ok: false, mode: 'failed', error: err instanceof Error ? err.message : String(err) };
	}
}

export function mailerIsConfigured(): boolean {
	return resolveSmtpConfig() !== null;
}
