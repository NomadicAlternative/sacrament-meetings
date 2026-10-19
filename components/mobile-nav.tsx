'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/locale-provider';

function isActive(localPath: string, path: string): boolean {
  if (path === '/') return localPath === '/';
  if (path === '/meetings') {
    return localPath === '/meetings' || /^\/meetings\/\d+$/.test(localPath);
  }
  return localPath === path;
}

// Menu hamburguesa para lideres (presidente, consejeros, secretario), a la
// derecha. Drawer lateral con glassmorphism: entra de derecha a izquierda con
// ease-out y los links aparecen en cascada (stagger). El icono se anima de
// hamburguesa a X.
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const localPath = pathname.replace(/^\/(es|pt)(?=\/|$)/, '') || '/';

  const links = [
    { path: '/', label: t('nav.home') },
    { path: '/meetings', label: t('nav.meetings') },
    { path: '/meetings/current', label: t('nav.current') },
    { path: '/meetings/new', label: t('nav.create') },
  ];

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
          <line
            x1="4"
            x2="20"
            y1="6"
            y2="6"
            className={`origin-center transition-all duration-300 ${
              open ? 'translate-y-[6px] rotate-45' : ''
            }`}
          />
          <line
            x1="4"
            x2="20"
            y1="12"
            y2="12"
            className={`transition-opacity duration-300 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <line
            x1="4"
            x2="20"
            y1="18"
            y2="18"
            className={`origin-center transition-all duration-300 ${
              open ? '-translate-y-[6px] -rotate-45' : ''
            }`}
          />
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
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold tracking-tight text-white/90">
              {t('nav.main')}
            </span>
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

          <nav className="flex flex-col gap-1.5">
            {links.map((link, index) => {
              const active = isActive(localPath, link.path);
              return (
                <Link
                  key={link.path}
                  href={`/${locale}${link.path === '/' ? '' : link.path}`}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex h-11 items-center rounded-lg px-4 text-base font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  } ${
                    active
                      ? 'bg-white text-accent'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{
                    transitionDelay: open ? `${150 + index * 60}ms` : '0ms',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
