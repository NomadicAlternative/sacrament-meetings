'use client';

import { useActionState } from 'react';
import {
  deleteUserAction,
  generateTemporaryPasswordAction,
  updateUserAction,
  type TemporaryPasswordState,
} from '@/lib/actions';
import { useLocale } from '@/components/locale-provider';
import { ALL_ROLES, type AppUser } from '@/lib/types';
import type { Dictionary } from '@/lib/i18n';

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

// One user row in the admin user-management table. It renders three actions:
// edit (name + role), generate a temporary password (shown once), and delete
// (with a browser confirm).
export function UserRowActions({ user }: { user: AppUser }) {
  const { locale, t } = useLocale();
  const [tempState, tempAction, isTempPending] = useActionState<
    TemporaryPasswordState,
    FormData
  >(generateTemporaryPasswordAction, {});

  return (
    <li className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium">{user.name ?? user.email}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <span className="text-xs text-muted">
          {t(`roles.${user.role}` as keyof Dictionary)} &middot;{' '}
          {t(`status.${user.status}` as keyof Dictionary)}
        </span>
      </div>

      <form action={updateUserAction} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={user.id} />
        <input type="hidden" name="locale" value={locale} />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">{t('users.name')}</label>
          <input
            name="name"
            type="text"
            defaultValue={user.name ?? ''}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">{t('users.role')}</label>
          <select name="role" defaultValue={user.role} className={inputClass}>
            {ALL_ROLES.map((role) => (
              <option key={role} value={role}>
                {t(`roles.${role}` as keyof Dictionary)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors duration-150 hover:border-accent hover:text-accent"
        >
          {t('users.save')}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <form action={tempAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={user.id} />
          <button
            type="submit"
            disabled={isTempPending}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors duration-150 hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {isTempPending ? t('users.generating') : t('users.generatePassword')}
          </button>
        </form>

        <form
          action={deleteUserAction}
          onSubmit={(e) => {
            if (!window.confirm(t('users.confirmDelete'))) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors duration-150 hover:border-red-600 hover:text-red-600"
          >
            {t('users.delete')}
          </button>
        </form>
      </div>

      {tempState.password ? (
        <div className="rounded-md bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/40">
          <p className="font-medium text-amber-800 dark:text-amber-200">
            {t('users.tempPassword')}
          </p>
          <code className="mt-1 inline-block rounded bg-white px-2 py-1 font-mono text-sm dark:bg-black/30">
            {tempState.password}
          </code>
        </div>
      ) : null}
    </li>
  );
}
