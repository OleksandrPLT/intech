// @ts-check
import { createRequire } from 'node:module';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// SSR means @astrojs/sitemap sees every route Astro knows about, including
// the private /app and /api ones, and can't auto-discover the /services and
// /news detail pages now that they read slugs from the database instead of
// getStaticPaths. So: filter the private stuff out below, and hand it the
// dynamic detail URLs explicitly, read straight from the SQLite file via
// plain better-sqlite3 (not the Drizzle/TS client — this file runs before
// Astro's TS pipeline is set up, so require() via createRequire is the
// straightforward way to pull in a CJS package here).
const site = 'https://intech.org.ua';
const require = createRequire(import.meta.url);

function dynamicPages() {
	try {
		const Database = require('better-sqlite3');
		const db = new Database(process.env.DATABASE_PATH || './data/app.db', { readonly: true, fileMustExist: true });
		const svcSlugs = db.prepare('SELECT slug FROM services').all().map((r) => r.slug);
		const newsSlugs = db.prepare('SELECT slug FROM news_posts').all().map((r) => r.slug);
		db.close();

		const langs = ['', '/en', '/et'];
		const pages = [];
		for (const prefix of langs) {
			for (const slug of svcSlugs) pages.push(`${site}${prefix}/services/${slug}`);
			for (const slug of newsSlugs) pages.push(`${site}${prefix}/news/${slug}`);
		}
		return pages;
	} catch {
		// No DB yet (fresh checkout before db:push/seed-content) — empty list,
		// not a broken build.
		return [];
	}
}

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/app/') && page !== `${site}/app` && !page.includes('/api/') && !page.includes('/login'),
      customPages: dynamicPages(),
    }),
  ],

  // Marketing pages opt into static prerendering individually
  // (export const prerender = true); everything under /app and /api
  // is dynamic — hence 'server' output.
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),
});
