import puppeteer, { type Browser } from 'puppeteer';

// One headless Chromium instance shared across requests — launching it
// fresh per PDF (~1-2s) would make every download noticeably slow. This is
// a low-traffic admin tool (receipts/invoices/contracts), so a single
// shared browser is plenty; --no-sandbox is the standard flag for
// server-side PDF rendering (works locally and is often required on a
// Linux VPS where Chromium's setuid sandbox isn't available).
let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
	// Re-launch if the cached instance died or got disconnected (e.g. after
	// a dev-server hot-reload cycle) instead of failing every request from
	// then on.
	if (browserPromise) {
		const existing = await browserPromise.catch(() => null);
		if (existing?.connected) return existing;
		browserPromise = null;
	}

	browserPromise = puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	return browserPromise;
}

/**
 * Renders an already-authenticated page of this same app to PDF — used for
 * the "Завантажити PDF" buttons on the receipt/invoice/contract documents.
 * Navigates for real (not just setContent) and forces print media, so it
 * respects the exact same @media print rules that hide the sidebar and
 * force a white background — the resulting PDF is exactly what "Друкувати"
 * would produce, just downloaded directly instead of going through the
 * OS print dialog (which is what was dragging the dark site chrome in).
 */
export async function renderPageToPdf(pageUrl: string, cookieHeader: string): Promise<Buffer> {
	const browser = await getBrowser();
	const page = await browser.newPage();
	try {
		if (cookieHeader) {
			await page.setExtraHTTPHeaders({ cookie: cookieHeader });
		}
		await page.goto(pageUrl, { waitUntil: 'networkidle0' });
		await page.emulateMediaType('print');
		const pdf = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
		});
		return Buffer.from(pdf);
	} finally {
		await page.close();
	}
}
