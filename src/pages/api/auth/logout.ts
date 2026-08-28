import type { APIRoute } from 'astro';
import { destroySession } from '../../../lib/session';

export const POST: APIRoute = ({ cookies, redirect }) => {
	destroySession(cookies);
	return redirect('/login');
};
