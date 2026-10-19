'use client';

import { useState } from 'react';
import NavLinks from '@/components/NavLinks';
import { useLocale } from '@/components/locale-provider';

// Menu hamburguesa para movil, solo para lideres (presidente, consejeros,
// secretario). Se abre como un drawer que entra de derecha a izquierda con
// ease-out (rapido al inicio, se frena al final).
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
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
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      <div
        id="mobile-nav-drawer"
        className={`fixed inset-0 z-40 ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-64 max-w-[80%] flex-col bg-slate-900 p-4 shadow-xl transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('nav.close')}
              className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
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
                <line x1="6" x2="18" y1="6" y2="18" />
                <line x1="18" x2="6" y1="6" y2="18" />
              </svg>
            </button>
          </div>
          <div onClick={() => setOpen(false)}>
            <NavLinks isLeader vertical />
          </div>
        </div>
      </div>
    </div>
  );
}
