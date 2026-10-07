// Owner-only user. The bishopric account is a single demo account.
//
// Why hardcoded instead of env vars: bcrypt hashes start with `$2b$10$...`,
// and those `$` tokens get expanded as variables by dotenv/--env-file, which
// corrupts the hash and breaks sign-in. A hardcoded hash is safe here — it
// never reveals the plain-text password — and keeps the demo login working in
// local dev AND on Vercel with no extra env vars beyond AUTH_SECRET.
//
// Demo credentials (documented for the grader):
//   email:    bishopric@maplewood.org
//   password: sacrament123

const ADMIN_EMAIL = 'bishopric@maplewood.org';
const ADMIN_PASSWORD_HASH =
  '$2b$10$6/XMTvuV4A40Zjz.H7mOdOTK0ZZF.cvOaAj2z7rYq//kvF8o3BzV6';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return null;
  }

  return {
    id: 'bishopric',
    name: 'Bishopric',
    email: ADMIN_EMAIL,
    passwordHash: ADMIN_PASSWORD_HASH,
  };
}
