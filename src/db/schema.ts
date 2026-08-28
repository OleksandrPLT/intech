import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * A user is an admin (you), staff (a team member you assign tasks to), or a
 * client. Nobody self-registers — an admin creates every account (see
 * scripts/create-admin.mjs and the "new client" form under /app/admin/clients).
 */
export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name').notNull(),
	role: text('role', { enum: ['admin', 'staff', 'client'] }).notNull().default('client'),
	// Richer client profile (admin/staff accounts just leave these empty).
	phone: text('phone'),
	companyName: text('company_name'),
	legalAddress: text('legal_address'),
	taxId: text('tax_id'), // ЄДРПОУ / РНОКПП / foreign equivalent
	country: text('country'), // ISO 3166-1 alpha-2, see src/lib/countries.ts
	preferredLanguage: text('preferred_language', { enum: ['uk', 'en', 'et'] }),
	// Admin-only — never rendered anywhere a client can reach.
	adminNotes: text('admin_notes'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const projects = sqliteTable('projects', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	clientId: integer('client_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	description: text('description'),
	websiteUrl: text('website_url'),
	status: text('status', {
		enum: ['discovery', 'in_progress', 'review', 'on_hold', 'done'],
	})
		.notNull()
		.default('discovery'),
	// The "CRM partially visible to clients" bit: the client sees this on
	// their project card, the admin controls it from /app/admin/projects.
	paymentStatus: text('payment_status', {
		enum: ['not_invoiced', 'invoiced', 'partially_paid', 'paid'],
	})
		.notNull()
		.default('not_invoiced'),
	// Контакти — who to actually put on a contract/receipt for this project.
	// Separate from the client account's own profile fields (users.*):
	// the account holder might be a manager, while the paying entity has
	// its own, different details — this is what receipt/invoice/contract
	// generation prefers when filled in, falling back to the client
	// profile otherwise.
	contactType: text('contact_type', { enum: ['individual', 'legal'] }).notNull().default('individual'),
	contactFullName: text('contact_full_name'),
	contactPhone: text('contact_phone'),
	contactEmail: text('contact_email'),
	contactAddress: text('contact_address'),
	contactCity: text('contact_city'),
	contactCompanyName: text('contact_company_name'),
	contactTaxId: text('contact_tax_id'),
	contactLegalAddress: text('contact_legal_address'),
	contactDirectorName: text('contact_director_name'),
	contactDirectorPhone: text('contact_director_phone'),
	contactDirectorEmail: text('contact_director_email'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const tickets = sqliteTable('tickets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	createdBy: integer('created_by')
		.notNull()
		.references(() => users.id),
	subject: text('subject').notNull(),
	// Short topic code so clients can pick what they need fast, and so tickets
	// get a human reference like VPN#00001 — see src/lib/ticketCategories.ts.
	category: text('category').notNull().default('GEN'),
	number: integer('number').notNull().default(0),
	status: text('status', {
		enum: ['open', 'in_progress', 'resolved', 'closed'],
	})
		.notNull()
		.default('open'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const ticketMessages = sqliteTable('ticket_messages', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	ticketId: integer('ticket_id')
		.notNull()
		.references(() => tickets.id),
	authorId: integer('author_id')
		.notNull()
		.references(() => users.id),
	body: text('body').notNull(),
	// Internal notes are admin-only "comments" — never sent to the client,
	// filtered out at the query level for client-facing pages/API.
	visibility: text('visibility', { enum: ['public', 'internal'] })
		.notNull()
		.default('public'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const ticketAttachments = sqliteTable('ticket_attachments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	messageId: integer('message_id')
		.notNull()
		.references(() => ticketMessages.id),
	filename: text('filename').notNull(),
	storedPath: text('stored_path').notNull(),
	mimeType: text('mime_type').notNull(),
	size: integer('size').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

/** Internal CRM pipeline — admin only, not tied to a user account until a lead becomes a client. */
export const leads = sqliteTable('leads', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	contact: text('contact'),
	source: text('source'),
	stage: text('stage', {
		enum: ['new', 'contacted', 'proposal', 'won', 'lost'],
	})
		.notNull()
		.default('new'),
	notes: text('notes'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

/** Public comments on news posts — held for admin approval before they show (spam control). */
export const newsComments = sqliteTable('news_comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull(),
	name: text('name').notNull(),
	body: text('body').notNull(),
	approved: integer('approved', { mode: 'boolean' }).notNull().default(false),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: text('expires_at').notNull(),
});

/** A lightweight per-project checklist — visible (read-only) to the client so they can see progress. */
export const tasks = sqliteTable('tasks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	title: text('title').notNull(),
	description: text('description'),
	status: text('status', { enum: ['todo', 'in_progress', 'done'] })
		.notNull()
		.default('todo'),
	assignedTo: integer('assigned_to').references(() => users.id),
	dueDate: text('due_date'),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

/**
 * Self-service custom fields — "налаштувати поля самостійно". One field
 * definition can attach to leads, projects, or client profiles; values are
 * stored generically in customFieldValues and rendered/collected dynamically
 * by src/lib/customFields.ts wherever that entity has a form.
 */
export const customFieldDefs = sqliteTable('custom_field_defs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	entity: text('entity', { enum: ['lead', 'project', 'client'] }).notNull(),
	key: text('key').notNull(),
	label: text('label').notNull(),
	type: text('type', {
		enum: ['text', 'textarea', 'number', 'date', 'select', 'boolean'],
	})
		.notNull()
		.default('text'),
	// Comma-separated options, only used when type = 'select'.
	options: text('options'),
	required: integer('required', { mode: 'boolean' }).notNull().default(false),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const customFieldValues = sqliteTable('custom_field_values', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	fieldId: integer('field_id')
		.notNull()
		.references(() => customFieldDefs.id),
	entityId: integer('entity_id').notNull(),
	value: text('value'),
});

/**
 * CMS content — editable from /app/admin/content/* instead of src/data/*.ts.
 * Same split as custom fields above: one language-neutral row per entity,
 * one row per language for the translatable text (unique on entity+lang).
 */
export const newsPosts = sqliteTable('news_posts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	date: text('date').notNull(),
	image: text('image'),
	icon: text('icon'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const newsPostTranslations = sqliteTable('news_post_translations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	postId: integer('post_id')
		.notNull()
		.references(() => newsPosts.id),
	lang: text('lang', { enum: ['uk', 'en', 'et'] }).notNull(),
	title: text('title').notNull(),
	excerpt: text('excerpt').notNull(),
	body: text('body').notNull(),
	// Optional per-language SEO overrides — fall back to title/excerpt when empty.
	metaTitle: text('meta_title'),
	metaDescription: text('meta_description'),
});

export const portfolioItems = sqliteTable('portfolio_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	url: text('url').notNull(),
	logo: text('logo'),
	tags: text('tags'), // comma-separated
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const portfolioItemTranslations = sqliteTable('portfolio_item_translations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	itemId: integer('item_id')
		.notNull()
		.references(() => portfolioItems.id),
	lang: text('lang', { enum: ['uk', 'en', 'et'] }).notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
});

export const services = sqliteTable('services', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	icon: text('icon', {
		enum: ['web', 'crm', 'custom', 'vpn', 'server', 'redesign', 'email', 'bot'],
	}).notNull(),
	sortOrder: integer('sort_order').notNull().default(0),
});

export const serviceTranslations = sqliteTable('service_translations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	serviceId: integer('service_id')
		.notNull()
		.references(() => services.id),
	lang: text('lang', { enum: ['uk', 'en', 'et'] }).notNull(),
	title: text('title').notNull(),
	summary: text('summary').notNull(),
	description: text('description').notNull(),
	features: text('features').notNull(), // one bullet per line
	forWhom: text('for_whom').notNull(), // one bullet per line
});

/** Site-wide settings (contact email, Telegram, …) — key/value, edited from /app/admin/settings/site. */
export const siteSettings = sqliteTable('site_settings', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
});

/**
 * API keys for embedding the ticket system into a client's own project
 * (their site creates/reads tickets via /api/v1/*). Scoped to exactly one
 * project — least privilege: a leaked key only exposes that project's
 * tickets, never your whole CRM.
 */
export const apiKeys = sqliteTable('api_keys', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	name: text('name').notNull(),
	keyHash: text('key_hash').notNull().unique(),
	keyPrefix: text('key_prefix').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
	revokedAt: text('revoked_at'),
});

/**
 * A shared file area on the project itself (separate from ticket
 * attachments) — either side can drop something here: a brief, a design
 * export, a signed contract. Access-checked with the same
 * canAccessProject() used for tickets.
 */
export const projectFiles = sqliteTable('project_files', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	uploadedBy: integer('uploaded_by')
		.notNull()
		.references(() => users.id),
	filename: text('filename').notNull(),
	storedPath: text('stored_path').notNull(),
	mimeType: text('mime_type').notNull(),
	size: integer('size').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

/**
 * The approval feed ("Стрічка на затвердження"): admin posts a version,
 * client approves it or requests changes with a comment.
 */
export const projectRevisions = sqliteTable('project_revisions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	createdBy: integer('created_by')
		.notNull()
		.references(() => users.id),
	title: text('title').notNull(),
	description: text('description'),
	fileId: integer('file_id').references(() => projectFiles.id),
	status: text('status', { enum: ['pending', 'approved', 'changes_requested'] })
		.notNull()
		.default('pending'),
	clientComment: text('client_comment'),
	respondedAt: text('responded_at'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

/**
 * Per-project credentials vault (hosting panel, FTP, registrar, CMS admin
 * logins…) — admin-only, encrypted at rest via src/lib/crypto.ts, never
 * exposed to anything client-facing. Encrypted, not hashed: it must be
 * recoverable, unlike a login password.
 */
export const projectCredentials = sqliteTable('project_credentials', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	label: text('label').notNull(),
	username: text('username'),
	encryptedPassword: text('encrypted_password').notNull(),
	notes: text('notes'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

/**
 * The general ledger — every income and expense entry, each tied to a
 * project and optionally backed by a receipt file (reuses
 * projectFiles/saveProjectFile, same storage as any other project file —
 * no separate upload path needed). Shown both inline on a project's
 * "Фінанси" tab and centrally on /app/admin/finance across all projects.
 */
/**
 * A bill sent to the client, before any money has changed hands — separate
 * from projectPayments (which is the ledger of money actually received or
 * spent). Status is editable (Не оплачено → Оплачено / Прострочено /
 * Скасовано) so an admin can track what's outstanding without that being
 * inferred from the payment ledger. Printable at
 * /app/admin/projects/[id]/invoice?bill=… (src/pages/app/admin/projects/[id]/invoice.astro).
 */
export const invoices = sqliteTable('invoices', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	amount: text('amount').notNull(),
	currency: text('currency', { enum: ['UAH', 'USD', 'EUR'] }).notNull().default('UAH'),
	description: text('description'),
	status: text('status', { enum: ['unpaid', 'paid', 'overdue', 'cancelled'] }).notNull().default('unpaid'),
	issuedAt: text('issued_at'),
	dueDate: text('due_date'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => users.id),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const projectPayments = sqliteTable('project_payments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	type: text('type', { enum: ['income', 'expense'] }).notNull().default('income'),
	amount: text('amount').notNull(),
	currency: text('currency', { enum: ['UAH', 'USD', 'EUR'] }).notNull().default('UAH'),
	note: text('note'),
	paidAt: text('paid_at'),
	// Which of the project's tasks this payment covers — comma-separated
	// task ids, picked via checkboxes on the "new entry" form (same
	// convention as portfolioItems.tags). Itemized on the receipt when set.
	taskIds: text('task_ids'),
	receiptFileId: integer('receipt_file_id').references(() => projectFiles.id),
	recordedBy: integer('recorded_by')
		.notNull()
		.references(() => users.id),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

/**
 * "Погодження" tab on a ticket — either side can ask the other to sign off
 * on something ("Прошу підтвердити рахунок на 200$") without it turning
 * into an open-ended reply thread. Separate from projectRevisions (which
 * is the whole-project approval feed) — this is scoped to one ticket.
 */
export const ticketApprovals = sqliteTable('ticket_approvals', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	ticketId: integer('ticket_id')
		.notNull()
		.references(() => tickets.id),
	requestedBy: integer('requested_by')
		.notNull()
		.references(() => users.id),
	title: text('title').notNull(),
	note: text('note'),
	status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
	decidedBy: integer('decided_by').references(() => users.id),
	decidedNote: text('decided_note'),
	decidedAt: text('decided_at'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});

/**
 * "Історія змін" tab — an audit trail for a ticket: status transitions and
 * approval decisions, so it's clear who changed what and when without
 * digging through the message thread (which only shows conversation, not
 * state changes).
 */
export const ticketEvents = sqliteTable('ticket_events', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	ticketId: integer('ticket_id')
		.notNull()
		.references(() => tickets.id),
	actorId: integer('actor_id')
		.notNull()
		.references(() => users.id),
	type: text('type', {
		enum: ['status_change', 'approval_requested', 'approval_decided', 'email_sent'],
	}).notNull(),
	fromValue: text('from_value'),
	toValue: text('to_value'),
	note: text('note'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`),
});
