import type { NextAuthConfig } from 'next-auth';

// Config that is safe to run in middleware. It must not import Node-only APIs
// such as `bcrypt`, so the providers live in auth.ts instead.
export const authConfig = {
  pages: {
    // Use our own login page instead of the Auth.js default.
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // The bishopric-only management area. Route groups do not change URLs,
      // so the (admin) pages live under these public paths.
      const isProtected =
        path.startsWith('/meetings/new') ||
        /^\/meetings\/\d+\/edit$/.test(path);

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // redirects unauthenticated users to /login
      }

      // Keep already-authenticated users out of the login page.
      if (isLoggedIn && path === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;
