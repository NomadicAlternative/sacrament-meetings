import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { listPendingRequests } from '@/lib/users';
import { approveRequestAction, rejectRequestAction } from '@/lib/actions';
import { ALL_ROLES } from '@/lib/types';
import { getDictionary, isLocale, type Dictionary, type Locale } from '@/lib/i18n';

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export default async function RequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'approved' || user.role !== 'president') {
    redirect(`/${loc}/login`);
  }

  const requests = await listPendingRequests();

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {dict['requests.title']}
        </h1>
        <p className="text-sm text-muted">{dict['requests.subtitle']}</p>
        <Link
          href={`/${loc}/admin/users`}
          className="w-fit text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {dict['users.title']}
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-muted">{dict['requests.empty']}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {requests.map((request) => (
            <li
              key={request.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div>
                <p className="font-medium">{request.name ?? request.email}</p>
                <p className="text-sm text-muted">{request.email}</p>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <form action={approveRequestAction} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={request.id} />
                  <input type="hidden" name="locale" value={loc} />
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={`role-${request.id}`}
                      className="text-xs text-muted"
                    >
                      {dict['requests.role']}
                    </label>
                    <select
                      id={`role-${request.id}`}
                      name="role"
                      defaultValue={request.role}
                      className={inputClass}
                    >
                      {ALL_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {dict[`roles.${role}` as keyof Dictionary]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-150 hover:opacity-90"
                  >
                    {dict['requests.approve']}
                  </button>
                </form>

                <form action={rejectRequestAction}>
                  <input type="hidden" name="id" value={request.id} />
                  <input type="hidden" name="locale" value={loc} />
                  <button
                    type="submit"
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors duration-150 hover:border-red-600 hover:text-red-600"
                  >
                    {dict['requests.reject']}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
