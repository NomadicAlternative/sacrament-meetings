'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/locale-provider';
import type { Locale } from '@/lib/i18n';

// Interruptor deslizante de idioma. Muestra PT a la izquierda y ES a la
// derecha, con un "thumb" blanco que se desliza sobre el idioma activo.
// Pensado para vivir sobre el header azul, por eso usa blancos translúcidos.
export function LanguageSwitcher() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const target: Locale = locale === 'es' ? 'pt' : 'es';
  const targetPath = pathname.replace(/^\/(es|pt)(?=\/|$)/, `/${target}`);
  const isEs = locale === 'es';

  return (
    <Link
      href={targetPath}
      aria-label={target === 'es' ? 'Cambiar a español' : 'Mudar para português'}
      title={target === 'es' ? 'Cambiar a español' : 'Mudar para português'}
      className="relative inline-flex shrink-0 items-center rounded-full border border-white/30 bg-white/10 p-1 text-sm font-bold"
    >
      {/* Thumb que se desliza sobre el idioma activo. */}
      <span
        aria-hidden="true"
        className={`absolute bottom-1 left-1 top-1 w-10 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
          isEs ? 'translate-x-10' : 'translate-x-0'
        }`}
      />
      <span
        className={`relative z-10 w-10 py-1 text-center transition-colors duration-200 ${
          isEs ? 'text-white/70' : 'text-accent'
        }`}
      >
        PT
      </span>
      <span
        className={`relative z-10 w-10 py-1 text-center transition-colors duration-200 ${
          isEs ? 'text-accent' : 'text-white/70'
        }`}
      >
        ES
      </span>
    </Link>
  );
}
