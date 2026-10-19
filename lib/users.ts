import { neon } from '@neondatabase/serverless';
import type { AppUser, MembershipStatus, Role } from './types';

const sql = neon(process.env.DATABASE_URL!);

// A user row plus its bcrypt hash. The hash lives only here and in auth.ts's
// authorize; it never reaches the session or the client.
export type UserWithPassword = AppUser & { passwordHash: string | null };

function mapRow(row: Record<string, unknown>): AppUser {
  return {
    id: row.id as number,
    email: row.email as string,
    name: (row.name as string | null) ?? null,
    role: row.role as Role,
    status: row.status as MembershipStatus,
    mustChangePassword: (row.mustChangePassword as boolean) ?? false,
  };
}

// Used by the Credentials provider to validate email + password.
export async function getUserByEmail(
  email: string,
): Promise<UserWithPassword | null> {
  const rows = await sql`
    SELECT
      id, email, name, role, status,
      must_change_password AS "mustChangePassword",
      password_hash AS "passwordHash"
    FROM users
    WHERE email = ${email.trim().toLowerCase()}
  `;

  const row = rows[0];
  if (!row) return null;

  return {
    ...mapRow(row),
    passwordHash: (row.passwordHash as string | null) ?? null,
  };
}

export async function getUserById(id: number): Promise<AppUser | null> {
  const rows = await sql`
    SELECT
      id, email, name, role, status,
      must_change_password AS "mustChangePassword"
    FROM users
    WHERE id = ${id}
  `;

  const row = rows[0];
  return row ? mapRow(row) : null;
}

// Creates (or re-opens) a membership request. `passwordHash` is optional: OAuth
// users have none, credentials users provide one so they can sign in later.
// An existing rejected/pending row is moved back to pending with the new role
// and password, so a denied user can request again.
export async function createMembershipRequest(input: {
  email: string;
  name: string | null;
  role: Role;
  passwordHash?: string | null;
}): Promise<AppUser> {
  const rows = await sql`
    INSERT INTO users (email, name, role, status, password_hash)
    VALUES (
      ${input.email.trim().toLowerCase()},
      ${input.name ?? null},
      ${input.role},
      'pending',
      ${input.passwordHash ?? null}
    )
    ON CONFLICT (email) DO UPDATE
      SET name          = COALESCE(EXCLUDED.name, users.name),
          role          = EXCLUDED.role,
          status        = 'pending',
          password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
          approved_at   = NULL,
          approved_by   = NULL
    RETURNING id, email, name, role, status, must_change_password AS "mustChangePassword"
  `;

  return mapRow(rows[0]);
}

export async function listPendingRequests(): Promise<AppUser[]> {
  const rows = await sql`
    SELECT
      id, email, name, role, status,
      must_change_password AS "mustChangePassword"
    FROM users
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `;

  return rows.map(mapRow);
}

export async function countPendingRequests(): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*)::int AS count FROM users WHERE status = 'pending'
  `;
  return Number(rows[0].count);
}

// All users (any status), for the admin user-management table.
export async function listAllUsers(): Promise<AppUser[]> {
  const rows = await sql`
    SELECT
      id, email, name, role, status,
      must_change_password AS "mustChangePassword"
    FROM users
    ORDER BY created_at ASC
  `;

  return rows.map(mapRow);
}

// Approves a request. The president may override the requested role here, so a
// self-assigned "president" role never slips through. Returns null when the
// request no longer exists (e.g. already handled in another tab).
export async function approveRequest(
  id: number,
  role: Role,
  approverId: number,
): Promise<AppUser | null> {
  const rows = await sql`
    UPDATE users
    SET status      = 'approved',
        role        = ${role},
        approved_at = now(),
        approved_by = ${approverId}
    WHERE id = ${id}
    RETURNING id, email, name, role, status, must_change_password AS "mustChangePassword"
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}

export async function rejectRequest(
  id: number,
  approverId: number,
): Promise<AppUser | null> {
  const rows = await sql`
    UPDATE users
    SET status      = 'rejected',
        approved_at = now(),
        approved_by = ${approverId}
    WHERE id = ${id}
    RETURNING id, email, name, role, status, must_change_password AS "mustChangePassword"
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}

// Updates a user's name and role (the email stays fixed: it is the sign-in).
export async function updateUser(
  id: number,
  updates: { name: string | null; role: Role },
): Promise<AppUser | null> {
  const rows = await sql`
    UPDATE users
    SET name = ${updates.name}, role = ${updates.role}
    WHERE id = ${id}
    RETURNING id, email, name, role, status, must_change_password AS "mustChangePassword"
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}

// Hard-deletes a user row.
export async function deleteUser(id: number): Promise<boolean> {
  const rows = await sql`
    DELETE FROM users WHERE id = ${id} RETURNING id
  `;

  return rows.length > 0;
}

// Sets a temporary password and flags the account so the user is forced to
// pick a new password on their next sign-in.
export async function setTemporaryPassword(
  id: number,
  passwordHash: string,
): Promise<AppUser | null> {
  const rows = await sql`
    UPDATE users
    SET password_hash = ${passwordHash}, must_change_password = true
    WHERE id = ${id}
    RETURNING id, email, name, role, status, must_change_password AS "mustChangePassword"
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}

// Records the user's own new password and clears the forced-change flag.
export async function changePassword(
  id: number,
  passwordHash: string,
): Promise<AppUser | null> {
  const rows = await sql`
    UPDATE users
    SET password_hash = ${passwordHash}, must_change_password = false
    WHERE id = ${id}
    RETURNING id, email, name, role, status, must_change_password AS "mustChangePassword"
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}
