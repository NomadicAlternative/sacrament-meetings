import type { NextAuthConfig } from 'next-auth';

// Config that is safe to run in middleware. It must not import Node-only APIs
// such as `bcrypt`, so the providers live in auth.ts instead.
//
// Authorization (protected routes + locale routing) lives in `proxy.ts`'s
// middleware wrapper, not here, because it needs the locale prefix from the
// URL and the resolved session together.
export const authConfig = {
  pages: {
    // Fallback sign-in path. The middleware normally redirects unauthenticated
    // users to /:locale/login directly; this value is a safety net for any
    // Auth.js-internal redirect, which the middleware then prefixes with a
    // locale on the next request.
    signIn: '/login',
  },
  providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;
