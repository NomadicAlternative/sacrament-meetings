'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/locale-provider';
import type { Locale } from '@/lib/i18n';

// Interruptor deslizante de idioma. Muestra PT a la izquierda y ES a la
// derecha, con un "thumb" azul que se desliza sobre el idioma activo. Al
// hacer clic navega a la misma ruta en el otro idioma.
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
      className="relative inline-flex shrink-0 items-center rounded-full border border-border bg-muted/10 p-1 text-sm font-bold"
    >
      {/* Thumb que se desliza sobre el idioma activo. */}
      <span
        aria-hidden="true"
        className={`absolute bottom-1 left-1 top-1 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-md transition-transform duration-200 ease-out ${
          isEs ? 'translate-x-10' : 'translate-x-0'
        }`}
      />
      <span
        className={`relative z-10 w-10 py-1 text-center transition-colors duration-200 ${
          isEs ? 'text-muted' : 'text-white'
        }`}
      >
        PT
      </span>
      <span
        className={`relative z-10 w-10 py-1 text-center transition-colors duration-200 ${
          isEs ? 'text-white' : 'text-muted'
        }`}
      >
        ES
      </span>
    </Link>
  );
}
