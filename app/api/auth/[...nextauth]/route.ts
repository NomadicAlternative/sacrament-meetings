import { handlers } from '@/auth';

// Auth.js v5 route handler. Exposes the /api/auth/* endpoints (csrf, session,
// callback/credentials, signout) that the sign-in server action and the
// session checks depend on.
export const { GET, POST } = handlers;
