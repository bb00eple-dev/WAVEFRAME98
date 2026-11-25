/* WAVEFRAME 98 FIX9: same-origin shell cache only. */
const CACHE_NAME = 'waveframe98-fix9-shell';
const ROOT = new URL('./', self.registration.scope).href;
const ROOT_PATH = new URL(ROOT).pathname;
const SHELL = [
  'index.html',
  'index.html?v=fix9',
  'converter-sandbox.html',
  'converter-sandbox.html?v=fix9',
  'library-downloader.html',
  'library-downloader.html?v=fix9',
  'manifest.webmanifest?v=fix9',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png'
].map(path => new URL(path, ROOT).href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of SHELL) {
      try {
        const response = await fetch(url, { cache: 'reload', credentials: 'same-origin' });
        if (response.ok && new URL(response.url).origin === self.location.origin) {
          await cache.put(url, response);
        }
      } catch (_) {}
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith('waveframe98-') && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(ROOT_PATH)) return;

  const isShell = request.mode === 'navigate' ||
    url.pathname.endsWith('/manifest.webmanifest') ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/converter-sandbox.html') ||
    url.pathname.endsWith('/library-downloader.html');

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (isShell) {
      try {
        const response = await fetch(request, { cache: 'no-store', credentials: 'same-origin' });
        if (response.ok && new URL(response.url).origin === self.location.origin) {
          await cache.put(request, response.clone());
        }
        return response;
      } catch (_) {
        return (await cache.match(request)) ||
          (await cache.match(new URL('index.html', ROOT).href)) || Response.error();
      }
    }

    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request, { credentials: 'same-origin' });
      if (response.ok && new URL(response.url).origin === self.location.origin) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
