/* WAVEFRAME 98 PWA FIX5: fresh worker URL and cache namespace */
const CACHE_NAME = 'waveframe98-fix5-shell';
const ROOT = new URL('./', self.registration.scope).href;
const SHELL = [
  'index.html',
  'manifest.webmanifest?v=fix5',
  'icons/icon-192.png',
  'icons/icon-512.png'
].map(path => new URL(path, ROOT).href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of SHELL) {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
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
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const shellRequest = req.mode === 'navigate' ||
    url.pathname.endsWith('/manifest.webmanifest') ||
    url.pathname.endsWith('/index.html');

  if (shellRequest) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(req, { cache: 'no-store' });
        if (response.ok) await cache.put(req, response.clone());
        return response;
      } catch (_) {
        return (await cache.match(req)) ||
          (await cache.match(new URL('index.html', ROOT).href)) ||
          Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
      const response = await fetch(req);
      if (response.ok && url.pathname.startsWith(new URL(ROOT).pathname)) {
        await cache.put(req, response.clone());
      }
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
