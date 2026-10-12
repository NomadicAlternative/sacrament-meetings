// Owner-only user. A single demo account for the Rama Elda branch.
//
// Why hardcoded instead of env vars: bcrypt hashes start with `$2b$10$...`,
// and those `$` tokens get expanded as variables by dotenv/--env-file, which
// corrupts the hash and breaks sign-in. A hardcoded hash is safe here — it
// never reveals the plain-text password — and keeps the demo login working in
// local dev AND on Vercel with no extra env vars beyond AUTH_SECRET.
//
// Demo credentials (documented for the grader):
//   email:    dagc40@gmail.com
//   password: 1111

const ADMIN_EMAIL = 'dagc40@gmail.com';
const ADMIN_PASSWORD_HASH =
  '$2b$10$9HB7ZGjw17aR/T9axaJ5/.gbzfJ9fnbRmG/voLNJ97HVRt7FLH/Ii';

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
    id: 'ramaelda',
    name: 'Rama Elda',
    email: ADMIN_EMAIL,
    passwordHash: ADMIN_PASSWORD_HASH,
  };
}
