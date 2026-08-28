/** Reads the "maximal client profile" fields shared by the create and edit client forms. */
export function extractProfileFields(formData: FormData) {
	return {
		phone: String(formData.get('phone') || '').trim() || null,
		companyName: String(formData.get('companyName') || '').trim() || null,
		legalAddress: String(formData.get('legalAddress') || '').trim() || null,
		taxId: String(formData.get('taxId') || '').trim() || null,
		country: String(formData.get('country') || '').trim() || null,
		preferredLanguage: (['uk', 'en', 'et'].includes(String(formData.get('preferredLanguage')))
			? String(formData.get('preferredLanguage'))
			: null) as 'uk' | 'en' | 'et' | null,
		adminNotes: String(formData.get('adminNotes') || '').trim() || null,
	};
}
