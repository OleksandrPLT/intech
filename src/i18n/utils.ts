import { ui, defaultLang, languages, type Lang, type UiKey } from './ui';

const nonDefaultLangs = (Object.keys(languages) as Lang[]).filter((l) => l !== defaultLang);

/** Derive the current language from a URL, based on its /<lang>/ path prefix. */
export function getLangFromUrl(url: URL): Lang {
	const [, maybeLang] = url.pathname.split('/');
	const match = nonDefaultLangs.find((l) => l === maybeLang);
	return match ?? defaultLang;
}

/** Returns a t(key) translator bound to the given language. */
export function useTranslations(lang: Lang) {
	return function t(key: UiKey): string {
		return ui[lang][key] ?? ui[defaultLang][key];
	};
}

/**
 * Builds the equivalent path in another language, given the current
 * (already-prefixed) pathname and the current language.
 * e.g. localizePath('/services/crm', 'uk', 'en') -> '/en/services/crm'
 *      localizePath('/en/services/crm', 'en', 'uk') -> '/services/crm'
 *      localizePath('/en/services/crm', 'en', 'et') -> '/et/services/crm'
 */
export function localizePath(pathname: string, from: Lang, to: Lang): string {
	const stripped = from === defaultLang ? pathname : pathname.replace(new RegExp(`^/${from}(/|$)`), '/');
	return localeUrl(to, stripped === '' ? '/' : stripped);
}

/** Prefix an unprefixed (default-language) path for the given language. */
export function localeUrl(lang: Lang, path: string): string {
	const clean = path.startsWith('/') ? path : `/${path}`;
	if (lang === defaultLang) return clean;
	return `/${lang}${clean === '/' ? '' : clean}`;
}
