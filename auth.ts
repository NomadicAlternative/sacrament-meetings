import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { getUserByEmail } from '@/lib/users';

// Full config with the Credentials provider. bcrypt and the user lookup are
// safe here because middleware imports auth.config.ts, never this file.
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Vercel and localhost sit behind a proxy, so Auth.js must trust the
  // forwarded host header to avoid the "UntrustedHost" error in production.
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUserByEmail(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        // Never put the password hash into the session token.
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});
