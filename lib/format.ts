import type { MeetingType } from './types';

// Etiquetas legibles para cada tipo de reunion. Se centralizan aca para que
// MeetingCard y MeetingDetail muestren siempre el mismo texto.
export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  testimony: 'Testimony',
  regular: 'Regular',
  stake: 'Stake',
  general: 'General'
};

// Formatea 'YYYY-MM-DD' como 'Sunday, September 13, 2026'.
//
// El detalle importante: se construye la fecha con Date.UTC y se formatea con
// timeZone 'UTC'. Si se construyera con new Date('2026-09-13') y se formateara
// en la zona local, un usuario en un huso negativo veria el dia anterior.
export function formatMeetingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
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

// Version corta para las tarjetas del listado: 'Sun, Sep 13'.
export function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
}
