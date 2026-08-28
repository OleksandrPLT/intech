import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// AES-256-GCM: real, recoverable encryption (not hashing — the point is to
// read a stored login/password back, not verify one). Key comes from
// CREDENTIALS_ENCRYPTION_KEY in production; locally (and on any deploy
// that hasn't set it yet) it's generated once into data/.encryption-key,
// which is already gitignored alongside data/app.db — so this works with
// zero setup, same as everything else in this app. Losing the key makes
// stored credentials unrecoverable by design; the README says to back it
// up once a real value is set.
const KEY_FILE = process.env.ENCRYPTION_KEY_FILE || './data/.encryption-key';

let cachedKey: Buffer | null = null;

function getKey(): Buffer {
	if (cachedKey) return cachedKey;

	const envKey = process.env.CREDENTIALS_ENCRYPTION_KEY;
	if (envKey) {
		cachedKey = crypto.createHash('sha256').update(envKey).digest();
		return cachedKey;
	}

	const dir = path.dirname(KEY_FILE);
	if (dir && dir !== '.' && !fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	if (fs.existsSync(KEY_FILE)) {
		cachedKey = Buffer.from(fs.readFileSync(KEY_FILE, 'utf8').trim(), 'hex');
		return cachedKey;
	}

	const generated = crypto.randomBytes(32);
	fs.writeFileSync(KEY_FILE, generated.toString('hex'), { mode: 0o600 });
	cachedKey = generated;
	return cachedKey;
}

/** Returns "iv:authTag:ciphertext", all hex, joined by ':'. */
export function encrypt(plaintext: string): string {
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
	const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();
	return [iv.toString('hex'), authTag.toString('hex'), ciphertext.toString('hex')].join(':');
}

export function decrypt(encoded: string): string {
	const [ivHex, authTagHex, ciphertextHex] = encoded.split(':');
	const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), Buffer.from(ivHex, 'hex'));
	decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
	return Buffer.concat([decipher.update(Buffer.from(ciphertextHex, 'hex')), decipher.final()]).toString('utf8');
}
