import crypto from 'node:crypto';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../db/client';
import { apiKeys, projects } from '../db/schema';

function sha256(input: string): string {
	return crypto.createHash('sha256').update(input).digest('hex');
}

/** Returns the plaintext key ONCE — only the hash is ever stored. */
export function createApiKey(projectId: number, name: string): string {
	const raw = `itk_live_${crypto.randomBytes(24).toString('hex')}`;
	db.insert(apiKeys)
		.values({ projectId, name, keyHash: sha256(raw), keyPrefix: raw.slice(0, 14) })
		.run();
	return raw;
}

export function revokeApiKey(id: number): void {
	db.update(apiKeys)
		.set({ revokedAt: new Date().toISOString() })
		.where(eq(apiKeys.id, id))
		.run();
}

export function listApiKeys(projectId: number) {
	return db.select().from(apiKeys).where(eq(apiKeys.projectId, projectId)).all();
}

/** Every key across every project, newest first — for the centralized /app/admin/api-keys page. */
export function listAllApiKeys() {
	return db
		.select({
			id: apiKeys.id,
			name: apiKeys.name,
			keyPrefix: apiKeys.keyPrefix,
			createdAt: apiKeys.createdAt,
			revokedAt: apiKeys.revokedAt,
			projectId: apiKeys.projectId,
			projectName: projects.name,
		})
		.from(apiKeys)
		.leftJoin(projects, eq(apiKeys.projectId, projects.id))
		.orderBy(desc(apiKeys.createdAt))
		.all();
}

/** Bearer-token auth for /api/v1/* — returns the key's project id, or null. */
export function resolveApiKey(authHeader: string | null): number | null {
	if (!authHeader?.startsWith('Bearer ')) return null;
	const raw = authHeader.slice('Bearer '.length).trim();
	if (!raw) return null;

	const row = db
		.select()
		.from(apiKeys)
		.where(and(eq(apiKeys.keyHash, sha256(raw)), isNull(apiKeys.revokedAt)))
		.get();

	return row?.projectId ?? null;
}
