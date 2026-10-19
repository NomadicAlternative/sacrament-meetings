import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

// Middleware que combina dos responsabilidades en un solo lugar:
//
// 1. Enrutado por idioma: toda ruta de pagina sin prefijo de idioma se
//    redirige al locale por defecto (/es). Las rutas API y los assets no se
//    tocan.
// 2. Autorizacion: las rutas de lider (/meetings/new y /meetings/[id]/edit)
//    exigen sesion; si no la hay, redirigen al login del idioma activo.
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Solo paginas: las API routes, los assets de Next y los archivos con
  // extension (favicon, emblem.webp, etc.) se dejan pasar.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return;
  }

  // 1. Locale: /meetings -> /es/meetings, / -> /es.
  const localeMatch = pathname.match(/^\/(es|pt)(?=\/|$)/);
  if (!localeMatch) {
    const url = new URL(`/es${pathname === '/' ? '' : pathname}`, nextUrl);
    url.search = nextUrl.search;
    return Response.redirect(url);
  }

  const locale = localeMatch[1];
  // Ruta sin el prefijo de idioma: /es/meetings -> /meetings.
  const path = pathname.replace(/^\/(es|pt)/, '') || '/';
  const isLoggedIn = !!req.auth?.user;

  // 2. Autorizacion: area de lider. Solo exige sesion; la autorizacion fina
  // por rol la hacen los Server Components y las Server Actions (defensa en
  // profundidad), porque el middleware no expone los campos custom del token.
  const isProtected =
    path.startsWith('/meetings/new') ||
    /^\/meetings\/\d+\/edit$/.test(path) ||
    path.startsWith('/meetings/hymns') ||
    path.startsWith('/admin/requests');

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL(`/${locale}/login`, nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  // Quien ya inicio sesion no necesita ver el login.
  if (isLoggedIn && path === '/login') {
    return Response.redirect(new URL(`/${locale}/meetings`, nextUrl));
  }

  // Permitir.
});

export const config = {
  // Corre en todas las rutas excepto API routes, internals de Next y assets.
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|svg|ico|webp|jpg|jpeg)$).*)'],
};
