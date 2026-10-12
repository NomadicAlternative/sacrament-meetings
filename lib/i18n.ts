import es from '@/messages/es.json';
import pt from '@/messages/pt.json';

export const locales = ['es', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

const dictionaries = { es, pt } as const;
export type Dictionary = (typeof dictionaries)[typeof defaultLocale];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export type Translate = (
  key: keyof Dictionary,
  vars?: Record<string, string | number>,
) => string;

// Builds a `t` bound to a specific dictionary. `{var}` tokens are replaced by
// the matching entry in `vars`, so strings like "Page {current} of {total}"
// stay in the dictionary instead of being assembled by hand.
export function makeT(dict: Dictionary): Translate {
  return (key, vars) => {
    let s: string = (dict[key] as string | undefined) ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replaceAll(`{${k}}`, String(v));
      }
    }
    return s;
  };
}
