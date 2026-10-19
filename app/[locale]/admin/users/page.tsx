import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { listAllUsers } from '@/lib/users';
import { UserRowActions } from '@/components/user-row-actions';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';

export default async function UsersPage({
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

  const users = await listAllUsers();

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {dict['users.title']}
        </h1>
        <p className="text-sm text-muted">{dict['users.subtitle']}</p>
        <Link
          href={`/${loc}/admin/requests`}
          className="w-fit text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {dict['requests.title']}
        </Link>
      </div>

      <ul className="flex flex-col gap-4">
        {users.map((u) => (
          <UserRowActions key={u.id} user={u} />
        ))}
      </ul>
    </section>
  );
}
