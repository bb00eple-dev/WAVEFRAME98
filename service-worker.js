/* WAVEFRAME 98 PWA offline shell. All URLs are resolved relative to the GitHub Pages project path. */
const CACHE_NAME = 'waveframe98-shell-v1';
const APP_ROOT = new URL('./', self.registration.scope).href;
const APP_SHELL = [
  APP_ROOT,
  new URL('index.html', APP_ROOT).href,
  new URL('manifest.webmanifest', APP_ROOT).href,
  new URL('icons/icon-192.png', APP_ROOT).href,
  new URL('icons/icon-512.png', APP_ROOT).href,
  new URL('icons/icon-512-maskable.png', APP_ROOT).href,
  new URL('icons/apple-touch-icon.png', APP_ROOT).href
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('waveframe98-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const requestURL = new URL(request.url);

  if (requestURL.origin !== self.location.origin) {
    // Cache the external pixel-font CSS/font files after first successful online load.
    if (requestURL.hostname === 'cdn.jsdelivr.net') {
      event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          return new Response('', { status: 503, statusText: 'Offline font unavailable' });
        }
      })());
    }
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          await cache.put(request, response.clone());
          return response;
        }
      } catch (error) {
        // Fall back to the cached app shell while offline.
      }
      return (await cache.match(request)) || (await cache.match(new URL('index.html', APP_ROOT).href)) || (await cache.match(APP_ROOT));
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      return new Response('', { status: 503, statusText: 'Offline resource unavailable' });
    }
  })());
});
