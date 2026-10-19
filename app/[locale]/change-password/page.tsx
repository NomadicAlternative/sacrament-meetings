import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ChangePasswordForm } from '@/components/change-password-form';
import { getDictionary, isLocale } from '@/lib/i18n';

export default async function ChangePasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'approved') {
    redirect(`/${loc}/login`);
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        {dict['changePassword.title']}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {dict['changePassword.subtitle']}
      </p>
      <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
