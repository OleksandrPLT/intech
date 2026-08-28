#!/usr/bin/env node
// Bootstraps the first admin account (or any account — pass --role client
// to create a client login instead). Clients don't self-register, so this
// script (or the "new client" form inside /app/admin/clients once you're
// logged in) is how every account gets made.
//
// Usage:
//   node scripts/create-admin.mjs --email you@intech.org.ua --name "Олександр Левков" --password "..."
//   node scripts/create-admin.mjs --email client@example.com --name "Client Name" --password "..." --role client
//   node scripts/create-admin.mjs --email dev@example.com --name "Team Member" --password "..." --role staff

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

function parseArgs(argv) {
	const args = {};
	for (let i = 0; i < argv.length; i += 1) {
		if (argv[i].startsWith('--')) {
			const key = argv[i].slice(2);
			const value = argv[i + 1];
			args[key] = value;
			i += 1;
		}
	}
	return args;
}

const args = parseArgs(process.argv.slice(2));
const { email, name, password } = args;
const role = ['client', 'staff', 'admin'].includes(args.role) ? args.role : 'admin';

if (!email || !name || !password) {
	console.error(
		'Usage: node scripts/create-admin.mjs --email you@example.com --name "Full Name" --password "secret" [--role admin|staff|client]',
	);
	process.exit(1);
}

if (password.length < 8) {
	console.error('Password must be at least 8 characters.');
	process.exit(1);
}

const dbPath = process.env.DATABASE_PATH || './data/app.db';
const db = new Database(dbPath);

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
if (existing) {
	console.error(`A user with email ${email} already exists (id ${existing.id}).`);
	process.exit(1);
}

const passwordHash = bcrypt.hashSync(password, 10);
const result = db
	.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)')
	.run(email, passwordHash, name, role);

console.log(`Created ${role} user #${result.lastInsertRowid}: ${name} <${email}>`);
