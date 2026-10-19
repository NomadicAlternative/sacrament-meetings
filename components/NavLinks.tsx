'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/locale-provider';

// usePathname es un hook de Client Component: por eso este archivo empieza
// con 'use client'. El resto de la app sigue siendo Server Components.

type NavLink = {
  path: string;
  label: string;
  leaderOnly?: boolean;
};

// Un enlace esta activo si la ruta actual (sin el prefijo de idioma) es
// exactamente la suya. Para "Meetings" tambien cuenta el detalle
// (/meetings/3), pero NO /meetings/current, que tiene su propio enlace.
function isActive(localPath: string, path: string): boolean {
  if (path === '/') return localPath === '/';
  if (path === '/meetings') {
    return localPath === '/meetings' || /^\/meetings\/\d+$/.test(localPath);
  }
  return localPath === path;
}

// Recibe el estado de sesion desde el Header (Server Component). El enlace de
// creacion solo se muestra a los lideres (presidente, consejeros, secretario);
// la ruta sigue protegida por el middleware y las pages aunque alguien ingrese
// la URL a mano. `vertical` se usa dentro del menu hamburguesa movil.
export default function NavLinks({
  isLeader,
  vertical = false,
}: {
  isLeader: boolean;
  vertical?: boolean;
}) {
  const { locale, t } = useLocale();
  const pathname = usePathname();

  // Quita el prefijo de idioma: /es/meetings -> /meetings.
  const localPath = pathname.replace(/^\/(es|pt)(?=\/|$)/, '') || '/';

  const links: NavLink[] = [
    { path: '/', label: t('nav.home') },
    { path: '/meetings', label: t('nav.meetings') },
    { path: '/meetings/current', label: t('nav.current') },
    { path: '/meetings/new', label: t('nav.create'), leaderOnly: true },
  ];

  const visibleLinks = links.filter((link) => !link.leaderOnly || isLeader);

  return (
    <nav aria-label={t('nav.main')} className={vertical ? '' : '-mx-1 px-1'}>
      <ul
        className={
          vertical
            ? 'flex flex-col gap-1'
            : 'flex items-center justify-center gap-1.5 overflow-x-auto'
        }
      >
        {visibleLinks.map(({ path, label }) => {
          const active = isActive(localPath, path);
          const base = vertical
            ? 'flex h-10 w-full items-center rounded-md px-3.5 text-sm '
            : 'inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3.5 text-sm ';
          const state = active
            ? 'bg-white font-semibold text-accent shadow-sm'
            : 'font-medium text-white/70 hover:bg-white/10 hover:text-white';

          return (
            <li key={path}>
              <Link
                href={`/${locale}${path === '/' ? '' : path}`}
                // aria-current le dice al lector de pantalla cual es la pagina
                // actual: el color solo no comunica nada a quien no lo ve.
                aria-current={active ? 'page' : undefined}
                className={`${base}${state} transition-colors duration-150`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
