export const projectStatusLabels: Record<string, string> = {
	discovery: 'Аналіз',
	in_progress: 'У роботі',
	review: 'На перевірці',
	on_hold: 'Призупинено',
	done: 'Завершено',
};

export const paymentStatusLabels: Record<string, string> = {
	not_invoiced: 'Рахунок не виставлено',
	invoiced: 'Виставлено рахунок',
	partially_paid: 'Частково оплачено',
	paid: 'Оплачено',
};

export const ticketStatusLabels: Record<string, string> = {
	open: 'Відкрито',
	in_progress: 'В роботі',
	resolved: 'Вирішено',
	closed: 'Закрито',
};

export const taskStatusLabels: Record<string, string> = {
	todo: 'До виконання',
	in_progress: 'В роботі',
	done: 'Готово',
};

export const leadStageLabels: Record<string, string> = {
	new: 'Новий',
	contacted: "Є контакт",
	proposal: 'Пропозиція',
	won: 'Виграно',
	lost: 'Втрачено',
};

export const ledgerTypeLabels: Record<string, string> = {
	income: 'Дохід',
	expense: 'Витрата',
};

export const invoiceStatusLabels: Record<string, string> = {
	unpaid: 'Не оплачено',
	paid: 'Оплачено',
	overdue: 'Прострочено',
	cancelled: 'Скасовано',
};

export const revisionStatusLabels: Record<string, string> = {
	pending: 'Очікує рішення',
	approved: 'Затверджено',
	changes_requested: 'Потрібні правки',
};
