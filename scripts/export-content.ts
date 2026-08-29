#!/usr/bin/env -S npx tsx
// Re-generates scripts/content-seed-data.json from the current database —
// run this after editing news/portfolio/services in the CMS
// (/app/admin/content/*) if you want a fresh deploy to start with that
// content too. seed-content.ts reads this file; it does NOT read the
// live database directly (a fresh deploy has no database yet).
//
// Usage: npx tsx scripts/export-content.ts

import fs from 'node:fs';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { db } from '../src/db/client';
import { newsPosts, newsPostTranslations, portfolioItems, portfolioItemTranslations, services, serviceTranslations } from '../src/db/schema';

const LANGS = ['uk', 'en', 'et'] as const;

const news = db
	.select()
	.from(newsPosts)
	.all()
	.map((n) => {
		const rows = db.select().from(newsPostTranslations).where(eq(newsPostTranslations.postId, n.id)).all();
		const translations = Object.fromEntries(
			LANGS.map((lang) => {
				const r = rows.find((row) => row.lang === lang)!;
				return [lang, { title: r.title, excerpt: r.excerpt, body: r.body }];
			}),
		);
		return { slug: n.slug, date: n.date, image: n.image, icon: n.icon, translations };
	});

const portfolio = db
	.select()
	.from(portfolioItems)
	.all()
	.map((p) => {
		const rows = db.select().from(portfolioItemTranslations).where(eq(portfolioItemTranslations.itemId, p.id)).all();
		const translations = Object.fromEntries(
			LANGS.map((lang) => {
				const r = rows.find((row) => row.lang === lang)!;
				return [lang, { title: r.title, description: r.description }];
			}),
		);
		return { url: p.url, logo: p.logo, tags: p.tags, sortOrder: p.sortOrder, translations };
	});

const svc = db
	.select()
	.from(services)
	.all()
	.map((s) => {
		const rows = db.select().from(serviceTranslations).where(eq(serviceTranslations.serviceId, s.id)).all();
		const translations = Object.fromEntries(
			LANGS.map((lang) => {
				const r = rows.find((row) => row.lang === lang)!;
				return [lang, { title: r.title, summary: r.summary, description: r.description, features: r.features, forWhom: r.forWhom }];
			}),
		);
		return { slug: s.slug, icon: s.icon, sortOrder: s.sortOrder, translations };
	});

const outPath = path.join(import.meta.dirname, 'content-seed-data.json');
fs.writeFileSync(outPath, JSON.stringify({ news, portfolio, services: svc }, null, '\t') + '\n');
console.log(`Wrote ${outPath} — news: ${news.length}, portfolio: ${portfolio.length}, services: ${svc.length}`);
