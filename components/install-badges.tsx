'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/components/locale-provider';

// Tipado mínimo del evento de instalación de Chrome. Solo existe en Chromium
// (Android/desktop); Safari de iOS nunca lo emite.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px] shrink-0"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 3.5v17c0 .8.9 1.3 1.6.9l14.6-8.5c.7-.4.7-1.4 0-1.8L5.6 2.6C4.9 2.2 4 2.7 4 3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px] shrink-0"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 12.9c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.7c1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.6 1.3-2.7 0-.1-2.5-1-2.5-3.8zM14.2 5.9c.7-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

// Dos badges estilo tienda: Google Play (instala en Android vía
// beforeinstallprompt) y App Store (muestra las instrucciones de iOS, ya que
// Apple no permite instalación programática).
export function InstallBadges() {
  const { t } = useLocale();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleAndroidInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }

  const badgeClass =
    'flex items-center gap-3 rounded-lg bg-accent px-4 py-2 text-left text-white shadow-md transition hover:opacity-90';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={handleAndroidInstall}
          className={badgeClass}
        >
          <PlayIcon />
          <span className="flex flex-col leading-tight">
            <span className="text-[9px] uppercase tracking-wide text-white/80">
              {t('install.onGooglePlay')}
            </span>
            <span className="text-base font-semibold">
              {t('install.googlePlay')}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowIosHelp((v) => !v)}
          className={badgeClass}
        >
          <AppleIcon />
          <span className="flex flex-col leading-tight">
            <span className="text-[9px] uppercase tracking-wide text-white/80">
              {t('install.onAppStore')}
            </span>
            <span className="text-base font-semibold">{t('install.appStore')}</span>
          </span>
        </button>
      </div>

      {showIosHelp && (
        <div className="w-full max-w-sm whitespace-pre-line rounded-lg border border-border bg-card p-4 text-sm text-muted">
          {t('install.iosSteps')}
        </div>
      )}
    </div>
  );
}
