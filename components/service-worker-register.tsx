'use client';

import { useEffect } from 'react';

// Registra el service worker una vez en el cliente. Renderiza null: su única
// tarea es el efecto secundario de registro, sin aportar markup.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // El registro puede fallar (p. ej. modo incógnito). No es crítico.
      });
    }
  }, []);

  return null;
}
