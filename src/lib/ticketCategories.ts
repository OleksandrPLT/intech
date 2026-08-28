/**
 * Short topic codes clients pick from when opening a ticket — mirrors the
 * service list on the marketing site, abbreviated. Drives both the quick-pick
 * dropdown and the human ticket number (e.g. VPN#00001).
 */
export const ticketCategories = [
	{ code: 'WEB', label: 'Сайт' },
	{ code: 'CRM', label: 'CRM-система' },
	{ code: 'DEV', label: 'Кастомний проект' },
	{ code: 'VPN', label: 'Корпоративний VPN' },
	{ code: 'SRV', label: 'Сервер' },
	{ code: 'RED', label: 'Редизайн' },
	{ code: 'MAIL', label: 'Пошта / Workspace' },
	{ code: 'BOT', label: 'Telegram-бот' },
	{ code: 'GEN', label: 'Інше' },
] as const;

export type TicketCategoryCode = (typeof ticketCategories)[number]['code'];

export const ticketCategoryLabels: Record<string, string> = Object.fromEntries(
	ticketCategories.map((c) => [c.code, c.label]),
);

export function isTicketCategory(value: string): value is TicketCategoryCode {
	return ticketCategories.some((c) => c.code === value);
}
