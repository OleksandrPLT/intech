import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { siteSettings } from '../db/schema';

/** Reads one site-wide setting (e.g. 'contact.email'), or the given fallback if it's never been set. */
export function getSiteSetting(key: string, fallback: string): string {
	const row = db.select().from(siteSettings).where(eq(siteSettings.key, key)).get();
	return row?.value ?? fallback;
}

export function setSiteSetting(key: string, value: string): void {
	const existing = db.select().from(siteSettings).where(eq(siteSettings.key, key)).get();
	if (existing) {
		db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key)).run();
	} else {
		db.insert(siteSettings).values({ key, value }).run();
	}
}
