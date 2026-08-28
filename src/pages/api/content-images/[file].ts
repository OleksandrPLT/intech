import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { contentImageAbsolutePath, safeFilename } from '../../../lib/uploads';

const EXT_TO_TYPE: Record<string, string> = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
};

/** Public, unauthenticated — these are marketing images (news covers, portfolio logos), not private files. */
export const GET: APIRoute = async ({ params }) => {
	const file = safeFilename(params.file || '');
	const fullPath = contentImageAbsolutePath(file);

	if (!fs.existsSync(fullPath)) return new Response('Not found', { status: 404 });

	const ext = path.extname(file).toLowerCase();
	const bytes = fs.readFileSync(fullPath);

	return new Response(bytes, {
		headers: {
			'Content-Type': EXT_TO_TYPE[ext] || 'application/octet-stream',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
