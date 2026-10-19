import { auth } from '@/auth';
import type { Role } from '@/lib/types';

// Roles with full access to meetings: the branch president (admin), the two
// counselors and the secretary.
const LEADER_ROLES: Role[] = [
  'president',
  'first_counselor',
  'second_counselor',
  'secretary',
];

export function isLeader(role: Role | undefined): boolean {
  return role != null && LEADER_ROLES.includes(role);
}

// Throws unless a leader (president, counselor, secretary) is signed in and
// approved. Defense in depth: the middleware keeps the pages behind a redirect,
// but a direct POST to a Server Action must also be rejected.
export async function requireLeaderSession() {
  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'approved' || !isLeader(user.role)) {
    throw new Error('Not authorized');
  }
  return session;
}

// Throws unless the signed-in user may edit hymns: the music director or any
// leader. Used by the hymns-only update action.
export async function requireHymnEditorSession() {
  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'approved') throw new Error('Not authorized');
  if (user.role !== 'music_director' && !isLeader(user.role)) {
    throw new Error('Not authorized');
  }
  return session;
}

// Throws unless the signed-in user is the branch president (the admin who
// approves and rejects membership requests).
export async function requirePresidentSession() {
  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'approved' || user.role !== 'president') {
    throw new Error('Not authorized');
  }
  return session;
}
