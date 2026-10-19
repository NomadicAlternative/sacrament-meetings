'use client';

import { useState } from 'react';
import NavLinks from '@/components/NavLinks';
import { useLocale } from '@/components/locale-provider';

// Menu hamburguesa para movil: el header muestra este boton en pantallas
// chicas (sm:hidden) en lugar de la barra horizontal. Abre un panel vertical
// con una transicion suave (max-height + opacity) sobre un fondo esmerilado.
export function MobileNav({ isLeader }: { isLeader: boolean }) {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={t('nav.main')}
        className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5"
        >
          {open ? (
            <>
              <line x1="6" x2="18" y1="6" y2="18" />
              <line x1="18" x2="6" y1="6" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </>
          )}
        </svg>
      </button>

      <div
        id="mobile-nav-panel"
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="mt-2 rounded-lg bg-white/10 p-2 backdrop-blur"
          onClick={() => setOpen(false)}
        >
          <NavLinks isLeader={isLeader} vertical />
        </div>
      </div>
    </div>
  );
}
