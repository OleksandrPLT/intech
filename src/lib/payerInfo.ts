import type { projects, users } from '../db/schema';

type Project = typeof projects.$inferSelect;
type Client = typeof users.$inferSelect | undefined | null;

/**
 * Who to bill — shared by receipt.astro, invoice.astro and contract.astro.
 * The project's own "Контакти" block (src/pages/api/admin/projects/[id]/contact.ts)
 * wins over the client account's profile when filled in: the account
 * holder might be a manager, while the actual paying entity has its own,
 * different details.
 */
export function resolvePayer(project: Project, client: Client, countryName: string): { name: string; lines: string[]; email: string } {
	const hasProjectContact =
		project.contactType === 'legal' ? Boolean(project.contactCompanyName) : Boolean(project.contactFullName);

	if (hasProjectContact) {
		if (project.contactType === 'legal') {
			return {
				name: project.contactCompanyName ?? '',
				lines: [
					project.contactLegalAddress,
					project.contactTaxId ? `ЄДРПОУ: ${project.contactTaxId}` : '',
					project.contactDirectorName ? `Директор: ${project.contactDirectorName}` : '',
				].filter((l): l is string => Boolean(l)),
				email: project.contactDirectorEmail || project.contactEmail || client?.email || '',
			};
		}
		return {
			name: project.contactFullName ?? '',
			lines: [project.contactAddress, project.contactCity].filter((l): l is string => Boolean(l)),
			email: project.contactEmail || client?.email || '',
		};
	}

	return {
		name: client?.companyName || client?.name || '',
		lines: [
			client?.companyName ? client?.name : '',
			client?.legalAddress,
			countryName,
			client?.taxId ? `ЄДРПОУ/РНОКПП: ${client.taxId}` : '',
		].filter((l): l is string => Boolean(l)),
		email: client?.email || '',
	};
}
