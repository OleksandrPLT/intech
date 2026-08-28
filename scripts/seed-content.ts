#!/usr/bin/env -S npx tsx
// One-time migration: copies the content that's been living in
// src/data/{news,portfolio,services}.ts into the new CMS tables, so
// switching /app/admin/content/* over to the database doesn't lose
// anything already on the site. Safe to re-run — it skips rows that
// already exist (matched by slug/url).
//
// Usage: npm run seed-content

import { db } from '../src/db/client';
import { newsPosts, newsPostTranslations, portfolioItems, portfolioItemTranslations, services, serviceTranslations } from '../src/db/schema';
import { news } from '../src/data/news';
import { portfolio } from '../src/data/portfolio';
import { services as serviceData } from '../src/data/services';
import { eq } from 'drizzle-orm';

const LANGS = ['uk', 'en', 'et'] as const;

function seedNews() {
	for (const item of news) {
		const existing = db.select().from(newsPosts).where(eq(newsPosts.slug, item.slug)).get();
		if (existing) {
			console.log(`news: "${item.slug}" already exists, skipping`);
			continue;
		}
		const result = db
			.insert(newsPosts)
			.values({ slug: item.slug, date: item.date, image: item.image ?? null, icon: item.icon ?? null })
			.run();
		const postId = Number(result.lastInsertRowid);
		for (const lang of LANGS) {
			db.insert(newsPostTranslations)
				.values({
					postId,
					lang,
					title: item.title[lang],
					excerpt: item.excerpt[lang],
					body: item.body[lang],
				})
				.run();
		}
		console.log(`news: seeded "${item.slug}"`);
	}
}

function seedPortfolio() {
	for (const [index, item] of portfolio.entries()) {
		const existing = db.select().from(portfolioItems).where(eq(portfolioItems.url, item.url)).get();
		if (existing) {
			console.log(`portfolio: "${item.url}" already exists, skipping`);
			continue;
		}
		const result = db
			.insert(portfolioItems)
			.values({
				url: item.url,
				logo: item.logo ?? null,
				tags: item.tags?.join(',') ?? null,
				sortOrder: index,
			})
			.run();
		const itemId = Number(result.lastInsertRowid);
		for (const lang of LANGS) {
			db.insert(portfolioItemTranslations)
				.values({
					itemId,
					lang,
					title: item.title[lang],
					description: item.description[lang],
				})
				.run();
		}
		console.log(`portfolio: seeded "${item.url}"`);
	}
}

function seedServices() {
	for (const [index, svc] of serviceData.entries()) {
		const existing = db.select().from(services).where(eq(services.slug, svc.slug)).get();
		if (existing) {
			console.log(`services: "${svc.slug}" already exists, skipping`);
			continue;
		}
		const result = db.insert(services).values({ slug: svc.slug, icon: svc.icon, sortOrder: index }).run();
		const serviceId = Number(result.lastInsertRowid);
		for (const lang of LANGS) {
			const content = svc[lang];
			db.insert(serviceTranslations)
				.values({
					serviceId,
					lang,
					title: content.title,
					summary: content.summary,
					description: content.description,
					features: content.features.join('\n'),
					forWhom: content.forWhom.join('\n'),
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
