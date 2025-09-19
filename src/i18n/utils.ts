import { ui, defaultLang } from '@/i18n/ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

/**
 * Replaces a {{variableName}} in a string by the value of the corresponding param key.
 *
 * EXAMPLE USAGE
 * Translation String: "Hello, {{name}}"
 * Params: { name: "John" }
 *
 * Output: "Hello, John"
 */
export function formatTranslationString(
  str: string,
  params: Record<string, string> = {},
) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || '');
}
