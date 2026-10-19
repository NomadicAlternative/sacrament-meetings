// Service worker para que la app sea instalable y funcione offline.
// Estrategia: network-first con fallback a caché, solo para GET same-origin.
// Las rutas /api/* (datos dinámicos y auth) nunca se cachean.

const CACHE = 'rama-eldas-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Nunca cachear la API ni auth: son datos dinámicos / de sesión.
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Solo cachear respuestas same-origin válidas (evita opacas/404).
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        // Cache miss devuelve undefined; respondWith(undefined) rompe con
        // "Failed to convert value to 'Response'", asi que se devuelve un
        // Response valido de offline como fallback.
        const cached = await caches.match(request);
        return (
          cached ??
          new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          })
        );
      }),
  );
});
