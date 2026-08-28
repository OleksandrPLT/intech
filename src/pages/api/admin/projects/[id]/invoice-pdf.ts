import type { APIRoute } from 'astro';
import { renderPageToPdf } from '../../../../../lib/pdf';

export const GET: APIRoute = async ({ params, url, request, locals }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const billId = url.searchParams.get('bill');
	if (!billId) return new Response('Missing bill', { status: 400 });

	const targetUrl = new URL(`/app/admin/projects/${params.id}/invoice?bill=${billId}&bare=1`, url.origin).toString();
	const cookie = request.headers.get('cookie') || '';

	try {
		const pdf = await renderPageToPdf(targetUrl, cookie);
		return new Response(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="invoice-${billId}.pdf"`,
			},
		});
	} catch (err) {
		console.error('[invoice-pdf] failed:', err);
		return new Response('Не вдалося згенерувати PDF', { status: 500 });
	}
};
