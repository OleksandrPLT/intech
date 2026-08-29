#!/usr/bin/env -S npx tsx
// One-time bootstrap: loads the real site content (news/portfolio/services)
// from scripts/content-seed-data.json into the CMS tables on a fresh
// database (new deploy, new machine). Safe to re-run — it skips rows that
// already exist (matched by slug/url), so it's also harmless on a database
// that already has content.
//
// content-seed-data.json is a snapshot of the actual content — it used to
// be imported straight from src/data/{news,portfolio,services}.ts, but
// those became DB-query functions (getServices() etc.) once /app/admin/content/*
// went live, so there was nothing left to import from. Re-export a fresh
// snapshot after editing content in the CMS with:
//   npx tsx scripts/export-content.ts
//
// Usage: npm run seed-content

import fs from 'node:fs';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { db } from '../src/db/client';
import { newsPosts, newsPostTranslations, portfolioItems, portfolioItemTranslations, services, serviceTranslations } from '../src/db/schema';

const LANGS = ['uk', 'en', 'et'] as const;

const dataPath = path.join(import.meta.dirname, 'content-seed-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as {
	news: { slug: string; date: string; image: string | null; icon: string | null; translations: Record<string, { title: string; excerpt: string; body: string }> }[];
	portfolio: { url: string; logo: string | null; tags: string | null; sortOrder: number; translations: Record<string, { title: string; description: string }> }[];
	services: { slug: string; icon: string; sortOrder: number; translations: Record<string, { title: string; summary: string; description: string; features: string; forWhom: string }> }[];
};

function seedNews() {
	for (const item of data.news) {
		const existing = db.select().from(newsPosts).where(eq(newsPosts.slug, item.slug)).get();
		if (existing) {
			console.log(`news: "${item.slug}" already exists, skipping`);
			continue;
		}
		const result = db
			.insert(newsPosts)
			.values({ slug: item.slug, date: item.date, image: item.image, icon: item.icon })
			.run();
		const postId = Number(result.lastInsertRowid);
		for (const lang of LANGS) {
			const t = item.translations[lang];
			db.insert(newsPostTranslations).values({ postId, lang, title: t.title, excerpt: t.excerpt, body: t.body }).run();
		}
		console.log(`news: seeded "${item.slug}"`);
	}
}

function seedPortfolio() {
	for (const item of data.portfolio) {
		const existing = db.select().from(portfolioItems).where(eq(portfolioItems.url, item.url)).get();
		if (existing) {
			console.log(`portfolio: "${item.url}" already exists, skipping`);
			continue;
		}
		const result = db
			.insert(portfolioItems)
			.values({ url: item.url, logo: item.logo, tags: item.tags, sortOrder: item.sortOrder })
			.run();
		const itemId = Number(result.lastInsertRowid);
		for (const lang of LANGS) {
			const t = item.translations[lang];
			db.insert(portfolioItemTranslations).values({ itemId, lang, title: t.title, description: t.description }).run();
		}
		console.log(`portfolio: seeded "${item.url}"`);
	}
}

function seedServices() {
	for (const svc of data.services) {
		const existing = db.select().from(services).where(eq(services.slug, svc.slug)).get();
		if (existing) {
			console.log(`services: "${svc.slug}" already exists, skipping`);
			continue;
		}
		const result = db
			.insert(services)
			.values({ slug: svc.slug, icon: svc.icon as any, sortOrder: svc.sortOrder })
			.run();
		const serviceId = Number(result.lastInsertRowid);
		for (const lang of LANGS) {
			const t = svc.translations[lang];
			db.insert(serviceTranslations)
				.values({
					serviceId,
					lang,
					title: t.title,
					summary: t.summary,
					description: t.description,
					features: t.features,
					forWhom: t.forWhom,
				})
				.run();
		}
		console.log(`services: seeded "${svc.slug}"`);
	}
}

seedNews();
seedPortfolio();
seedServices();
console.log('Done.');
