import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { projects, tickets } from '../db/schema';
import type { SessionUser } from './session';

/** A client may only touch tickets/projects that belong to them; an admin may touch any. */
export function canAccessProject(user: SessionUser, projectId: number): boolean {
	if (user.role === 'admin') return true;
	const project = db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).get();
	return project?.clientId === user.id;
}

export function canAccessTicket(user: SessionUser, ticketId: number): boolean {
	if (user.role === 'admin') return true;
	const ticket = db.select({ projectId: tickets.projectId }).from(tickets).where(eq(tickets.id, ticketId)).get();
	if (!ticket) return false;
	return canAccessProject(user, ticket.projectId);
}
