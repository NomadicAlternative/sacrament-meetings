'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/components/locale-provider';

// Tipado mínimo del evento de instalación de Chrome. Solo existe en Chromium
// (Android/desktop); Safari de iOS nunca lo emite, por eso el botón queda
// oculto ahí (el usuario usa Compartir → Agregar a inicio).
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
  const { t } = useLocale();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Solo se muestra cuando el navegador ofrece instalación automática.
  if (!deferredPrompt) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="block whitespace-nowrap rounded-md border border-accent px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
    >
      {t('install.install')}
    </button>
  );
}
