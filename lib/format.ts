import type { MeetingType } from './types';
import type { Locale } from './i18n';

// BCP 47 tags per locale, so dates render with the right weekday/month names.
const LOCALE_TAG: Record<Locale, string> = {
  es: 'es-ES',
  pt: 'pt-BR',
};

export function getLocaleTag(locale: Locale): string {
  return LOCALE_TAG[locale];
}

// Formatea 'YYYY-MM-DD' como 'domingo, 13 de septiembre de 2026' (según locale).
//
// El detalle importante: se construye la fecha con Date.UTC y se formatea con
// timeZone 'UTC'. Si se construyera con new Date('2026-09-13') y se formateara
// en la zona local, un usuario en un huso negativo veria el dia anterior.
export function formatMeetingDate(isoDate: string, locale: Locale): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString(LOCALE_TAG[locale], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// Convierte un Date a 'YYYY-MM-DD' usando la fecha LOCAL.
//
// No se usa toISOString(): esa funcion pasa a UTC, y en un huso horario
// negativo (por ejemplo UTC-6) a las 20:00 del domingo devolveria el lunes.
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Version corta para las tarjetas del listado: 'dom 13 sept'.
export function formatShortDate(isoDate: string, locale: Locale): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString(LOCALE_TAG[locale], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// Helper para los componentes: la etiqueta de tipo vive en los diccionarios
// (type.testimony, type.regular, ...), asi que aqui solo se expone el tipo.
export type { MeetingType };
