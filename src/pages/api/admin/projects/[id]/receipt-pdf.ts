import type { APIRoute } from 'astro';
import { renderPageToPdf } from '../../../../../lib/pdf';

// Downloads a real PDF instead of relying on the browser's print dialog
// (which was dragging the dark site chrome in on some setups). Navigates
// Puppeteer to the already-built receipt page of this same app, forwarding
// the admin's session cookie so it renders as them, then converts that
// live (print-media-emulated) page to PDF.
export const GET: APIRoute = async ({ params, url, request, locals }) => {
	if (locals.user?.role !== 'admin') {
		return new Response('Forbidden', { status: 403 });
	}

	const paymentId = url.searchParams.get('payment');
	if (!paymentId) return new Response('Missing payment', { status: 400 });

	const targetUrl = new URL(`/app/admin/projects/${params.id}/receipt?payment=${paymentId}&bare=1`, url.origin).toString();
	const cookie = request.headers.get('cookie') || '';

	try {
		const pdf = await renderPageToPdf(targetUrl, cookie);
		return new Response(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="receipt-${paymentId}.pdf"`,
			},
		});
	} catch (err) {
		console.error('[receipt-pdf] failed:', err);
		return new Response('Не вдалося згенерувати PDF', { status: 500 });
	}
};
