import { eq, and, asc } from 'drizzle-orm';
import { db } from '../db/client';
import { customFieldDefs, customFieldValues } from '../db/schema';

export type EntityType = 'lead' | 'project' | 'client';
export type FieldDef = typeof customFieldDefs.$inferSelect;

export function getFieldDefs(entity: EntityType): FieldDef[] {
	return db
		.select()
		.from(customFieldDefs)
		.where(eq(customFieldDefs.entity, entity))
		.orderBy(asc(customFieldDefs.sortOrder), asc(customFieldDefs.id))
		.all();
}

/** key -> value map for one record, ready to prefill a form or render a detail view. */
export function getFieldValues(entity: EntityType, entityId: number): Record<string, string> {
	const defs = getFieldDefs(entity);
	if (defs.length === 0) return {};

	const values = db.select().from(customFieldValues).where(eq(customFieldValues.entityId, entityId)).all();
	const byFieldId = new Map(values.map((v) => [v.fieldId, v.value ?? '']));

	const result: Record<string, string> = {};
	for (const def of defs) {
		result[def.key] = byFieldId.get(def.id) ?? '';
	}
	return result;
}

/** Reads `field_<id>` entries out of submitted form data and upserts them for entityId. */
export function saveFieldValues(entity: EntityType, entityId: number, formData: FormData): void {
	const defs = getFieldDefs(entity);
	for (const def of defs) {
		const raw = formData.get(`field_${def.id}`);
		const value = def.type === 'boolean' ? (raw ? '1' : '0') : String(raw ?? '').trim();

		const existing = db
			.select({ id: customFieldValues.id })
			.from(customFieldValues)
			.where(and(eq(customFieldValues.fieldId, def.id), eq(customFieldValues.entityId, entityId)))
			.get();

		if (existing) {
			db.update(customFieldValues).set({ value }).where(eq(customFieldValues.id, existing.id)).run();
		} else {
			db.insert(customFieldValues).values({ fieldId: def.id, entityId, value }).run();
		}
	}
}

export const fieldTypeLabels: Record<string, string> = {
	text: 'Текст',
	textarea: 'Багаторядковий текст',
	number: 'Число',
	date: 'Дата',
	select: 'Список (select)',
	boolean: 'Так/Ні',
};

export const entityLabels: Record<EntityType, string> = {
	lead: 'Лід',
	project: 'Проект',
	client: 'Клієнт',
};
