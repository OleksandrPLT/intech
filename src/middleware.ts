import { defineMiddleware } from 'astro:middleware';
import { getCurrentUser } from './lib/session';

export const onRequest = defineMiddleware((context, next) => {
	const path = context.url.pathname;

	// admin.intech.org.ua (or admin.localhost locally) is just the same app,
	// reached at a nicer hostname — the only special case is sending the
	// bare root to the cabinet instead of the marketing homepage.
	if (context.url.hostname.startsWith('admin.') && path === '/') {
		return context.redirect('/app');
	}

	const isAppRoute = path === '/app' || path.startsWith('/app/');
	// /api/v1/* authenticates externally via a project API key (Bearer token),
	// never our session cookie — no reason to touch cookies for it here.
	const isInternalApiRoute = path.startsWith('/api/') && !path.startsWith('/api/v1/');
	const needsAuth = isAppRoute || isInternalApiRoute;

	// Marketing pages are static/prerendered — skip touching cookies there
	// entirely (also avoids a build-time warning about reading headers on
	// prerendered routes).
	if (!needsAuth) {
		return next();
	}

	const user = getCurrentUser(context.cookies);
	context.locals.user = user;

	if (isAppRoute) {
		if (!user) {
			const redirectTo = encodeURIComponent(path);
			return context.redirect(`/login?redirect=${redirectTo}`);
		}

		const isAdminRoute = path.startsWith('/app/admin');
		if (isAdminRoute && user.role !== 'admin') {
			return context.redirect('/app');
		}

		const isStaffRoute = path.startsWith('/app/staff');
		if (isStaffRoute && user.role !== 'staff' && user.role !== 'admin') {
			return context.redirect('/app');
		}
	}

	return next();
});
