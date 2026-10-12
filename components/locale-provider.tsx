'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Dictionary, Locale, Translate } from '@/lib/i18n';
import { makeT } from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  t: Translate;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// Wraps the tree with the active locale and its translator. Server components
// read the locale from the route params; client components consume it here.
export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, t: makeT(dict) }), [locale, dict]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (ctx === null) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}
