import fs from 'node:fs';
import path from 'node:path';

const UPLOAD_ROOT = process.env.UPLOAD_DIR || './data/uploads';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export function safeFilename(name: string): string {
	return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-120) || 'file';
}

/** Saves an uploaded File to disk under a per-ticket folder; returns the relative stored path, or null if no file was sent. */
export async function saveAttachment(ticketId: number, file: File): Promise<{
	storedPath: string;
	filename: string;
	mimeType: string;
	size: number;
} | null> {
	if (!file || file.size === 0) return null;
	if (file.size > MAX_SIZE) {
		throw new Error('Файл завеликий (максимум 10 МБ).');
	}

	const dir = path.join(UPLOAD_ROOT, String(ticketId));
	fs.mkdirSync(dir, { recursive: true });

	const stored = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFilename(file.name)}`;
	const fullPath = path.join(dir, stored);
	const buffer = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(fullPath, buffer);

	return {
		storedPath: path.join(String(ticketId), stored),
		filename: file.name,
		mimeType: file.type || 'application/octet-stream',
		size: file.size,
	};
}

export function attachmentAbsolutePath(storedPath: string): string {
	return path.join(UPLOAD_ROOT, storedPath);
}

const CONTENT_IMAGE_ROOT = process.env.CONTENT_IMAGE_DIR || './data/content-images';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Saves a public marketing image (news cover, portfolio logo) and returns
 * the URL path to reference it at — /api/content-images/[file].ts serves it
 * back, unauthenticated, since these are meant to be public. Returns null
 * if no file was sent, so callers can just keep whatever was there before.
 */
export async function saveContentImage(file: File | null): Promise<string | null> {
	if (!file || file.size === 0) return null;
	if (file.size > MAX_IMAGE_SIZE) {
		throw new Error('Зображення завелике (максимум 5 МБ).');
	}

	fs.mkdirSync(CONTENT_IMAGE_ROOT, { recursive: true });

	const stored = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFilename(file.name)}`;
	const buffer = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(path.join(CONTENT_IMAGE_ROOT, stored), buffer);

	return `/api/content-images/${stored}`;
}

export function contentImageAbsolutePath(filename: string): string {
	return path.join(CONTENT_IMAGE_ROOT, filename);
}

const PROJECT_FILE_ROOT = process.env.PROJECT_FILE_DIR || './data/project-files';

/**
 * Saves a file to the project's shared file area (separate from ticket
 * attachments — see projectFiles in the schema). Same access-checked,
 * private-by-default shape as saveAttachment: served back only through
 * /api/project-files/[id].ts, which checks canAccessProject() first.
 */
export async function saveProjectFile(projectId: number, file: File): Promise<{
	storedPath: string;
	filename: string;
	mimeType: string;
	size: number;
} | null> {
	if (!file || file.size === 0) return null;
	if (file.size > MAX_SIZE) {
		throw new Error('Файл завеликий (максимум 10 МБ).');
	}

	const dir = path.join(PROJECT_FILE_ROOT, String(projectId));
	fs.mkdirSync(dir, { recursive: true });

	const stored = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFilename(file.name)}`;
	const fullPath = path.join(dir, stored);
	const buffer = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(fullPath, buffer);

	return {
		storedPath: path.join(String(projectId), stored),
		filename: file.name,
		mimeType: file.type || 'application/octet-stream',
		size: file.size,
	};
}

export function projectFileAbsolutePath(storedPath: string): string {
	return path.join(PROJECT_FILE_ROOT, storedPath);
}
