import NextAuth from 'next-auth';
import type { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { getUserByEmail } from '@/lib/users';
import { defaultLocale } from '@/lib/i18n';
import type { MembershipStatus, Role } from '@/lib/types';

// The session/user carry the branch role and membership status, so Server
// Components and Server Actions can authorize by role without a second lookup.
declare module 'next-auth' {
  interface Session {
    user: {
      userId?: number;
      role?: Role;
      status?: MembershipStatus;
    } & DefaultSession['user'];
  }
  interface User {
    userId?: number;
    role?: Role;
    mustChangePassword?: boolean;
  }
}

// The JWT is not augmented here (the `next-auth/jwt` module is a re-export of
// `@auth/core/jwt` and does not resolve as an augmentation target in this
// setup). The callbacks below read/write the custom fields through a local
// structural type instead.
type AuthToken = {
  userId?: number;
  role?: Role;
  status?: MembershipStatus;
};

// OAuth providers are registered only when their credentials exist in the
// environment. This keeps the build and the local dev flow green before the
// Google/Microsoft client ids are configured, and the login UI hides the
// corresponding buttons based on the same check.
const oauthProviders = [];
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  oauthProviders.push(Google);
}
if (
  process.env.AUTH_MICROSOFT_ENTRA_ID &&
  process.env.AUTH_MICROSOFT_ENTRA_SECRET
) {
  oauthProviders.push(MicrosoftEntraID);
}

// Full config with the providers. bcrypt and the user lookup are safe here
// because middleware imports auth.config.ts, never this file.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Vercel and localhost sit behind a proxy, so Auth.js must trust the
  // forwarded host header to avoid the "UntrustedHost" error in production.
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(4) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUserByEmail(email);
        // Only approved members sign in; pending/rejected are denied here too,
        // not just hidden in the UI.
        if (!user || user.status !== 'approved' || !user.passwordHash) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        // Never put the password hash into the session token. `id` is the
        // string Auth.js expects; `userId` is the numeric DB id used by the
        // approval actions.
        return {
          id: String(user.id),
          userId: user.id,
          name: user.name ?? user.email,
          email: user.email,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
    ...oauthProviders,
  ],
  callbacks: {
    // Resolves role/status once at sign-in and stores them on the JWT so the
    // session callback (and every later request) can read them without a DB hit.
    async jwt({ token, user, account }) {
      const t = token as unknown as AuthToken;
      if (user) {
        if (account?.provider === 'credentials') {
          const u = user as unknown as { userId?: number; role?: Role };
          t.userId = u.userId;
          t.role = u.role;
          t.status = 'approved';
        } else {
          // OAuth: the provider profile has no role, so look it up by email.
          const u = user as unknown as { email?: string | null };
          const dbUser = await getUserByEmail(u.email ?? '');
          if (dbUser) {
            t.userId = dbUser.id;
            t.role = dbUser.role;
            t.status = dbUser.status;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      const t = token as unknown as AuthToken;
      if (session.user) {
        session.user.userId = t.userId;
        session.user.role = t.role;
        session.user.status = t.status;
      }
      return session;
    },
    // OAuth gate: only an existing approved member may complete the OAuth
    // sign-in. Pending/rejected/unknown emails are bounced to the login page
    // with a flag so the client can show the right state (or the request modal).
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        const u = user as { mustChangePassword?: boolean };
        if (u.mustChangePassword) {
          return `/${defaultLocale}/change-password`;
        }
        return true;
      }

      const email = user.email;
      if (!email) return false;

      const existing = await getUserByEmail(email);
      if (existing?.status === 'approved') {
        if (existing.mustChangePassword) {
          return `/${defaultLocale}/change-password`;
        }
        return true;
      }

      if (existing?.status === 'pending') {
        return `/${defaultLocale}/login?status=pending`;
      }
      if (existing?.status === 'rejected') {
        return `/${defaultLocale}/login?status=rejected`;
      }
      // Not registered: send them to the request-access modal with their
      // provider name and email pre-filled.
      const name = encodeURIComponent(user.name ?? '');
      return `/${defaultLocale}/login?request=1&email=${encodeURIComponent(email)}&name=${name}`;
    },
  },
});
