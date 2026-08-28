import type { APIRoute } from 'astro';
import { renderPageToPdf } from '../../../../../lib/pdf';

// Forwards every query param the contract editor form produced (version,
// payer/executor overrides, subject, amount, …) straight through — the
// contract page has no stored id to key off, it's rendered fresh from the
// query string each time.
export const GET: APIRoute = async ({ params, url, request, locals }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const targetParams = new URLSearchParams(url.search);
	targetParams.set('bare', '1');
	const targetUrl = new URL(`/app/admin/projects/${params.id}/contract?${targetParams.toString()}`, url.origin).toString();
	const cookie = request.headers.get('cookie') || '';

	try {
		const pdf = await renderPageToPdf(targetUrl, cookie);
		return new Response(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="contract-${params.id}.pdf"`,
			},
		});
	} catch (err) {
		console.error('[contract-pdf] failed:', err);
		return new Response('Не вдалося згенерувати PDF', { status: 500 });
	}
};
