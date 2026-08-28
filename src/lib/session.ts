import type { AstroCookies } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { sessions, users } from '../db/schema';

const SESSION_COOKIE = 'session';
const SESSION_DAYS = 30;

export type SessionUser = typeof users.$inferSelect;

function randomToken(): string {
	return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
}

export function createSession(userId: number, cookies: AstroCookies): void {
	const id = randomToken();
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
	db.insert(sessions).values({ id, userId, expiresAt }).run();
	cookies.set(SESSION_COOKIE, id, {
		path: '/',
		httpOnly: true,
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: SESSION_DAYS * 24 * 60 * 60,
	});
}

export function destroySession(cookies: AstroCookies): void {
	const id = cookies.get(SESSION_COOKIE)?.value;
	if (id) {
		db.delete(sessions).where(eq(sessions.id, id)).run();
	}
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function defaultAppPath(role: SessionUser['role']): string {
	if (role === 'admin') return '/app/admin';
	if (role === 'staff') return '/app/staff';
	return '/app/client';
}

export function getCurrentUser(cookies: AstroCookies): SessionUser | null {
	const id = cookies.get(SESSION_COOKIE)?.value;
	if (!id) return null;

	const session = db.select().from(sessions).where(eq(sessions.id, id)).get();
	if (!session) return null;

	if (new Date(session.expiresAt).getTime() < Date.now()) {
		db.delete(sessions).where(eq(sessions.id, id)).run();
		return null;
	}

	return db.select().from(users).where(eq(users.id, session.userId)).get() ?? null;
}
