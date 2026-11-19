/* WAVEFRAME 98 PWA FIX7: refreshes shell for the in-app library build */
const CACHE_NAME = 'waveframe98-fix7-shell';
const ROOT = new URL('./', self.registration.scope).href;
const SHELL = [
  'index.html',
  'manifest.webmanifest?v=fix7',
  'icon-192.png',
  'icon-512.png'
].map(path => new URL(path, ROOT).href);
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of SHELL) {
      try { const response = await fetch(url, {cache:'reload'}); if (response.ok) await cache.put(url,response); } catch (_) {}
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('waveframe98-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  const shell=req.mode==='navigate'||url.pathname.endsWith('/manifest.webmanifest')||url.pathname.endsWith('/index.html');
  if(shell){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE_NAME);
      try{const res=await fetch(req,{cache:'no-store'});if(res.ok)await cache.put(req,res.clone());return res;}
      catch(_){return (await cache.match(req))||(await cache.match(new URL('index.html',ROOT).href))||Response.error();}
    })());return;
  }
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME),hit=await cache.match(req);if(hit)return hit;
    try{const res=await fetch(req);if(res.ok&&url.pathname.startsWith(new URL(ROOT).pathname))await cache.put(req,res.clone());return res;}
    catch(_){return Response.error();}
  })());
});
