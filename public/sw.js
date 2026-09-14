const CACHE_NAME = 'alquran-v2';

const STATIC_ASSETS = ['/', '/index.html', '/icon-192.png', '/icon-512.png', '/manifest.json'];



async function precacheBuildAssets(cache) {

  try {

    const res = await fetch('/index.html', { cache: 'reload' });

    if (!res.ok) return;

    const html = await res.text();

    const re = new RegExp('(?:src|href)="(/assets/[^"]+)"', 'g');

    const urls = [...html.matchAll(re)].map((m) => m[1]);

    await Promise.all(urls.map((u) => cache.add(u).catch(() => {})));

  } catch (e) {}

}



self.addEventListener('install', (event) => {

  event.waitUntil((async () => {

    const cache = await caches.open(CACHE_NAME);

    await cache.addAll(STATIC_ASSETS).catch(() => {});

    await precacheBuildAssets(cache);

  })());

  self.skipWaiting();

});



self.addEventListener('activate', (event) => {

  event.waitUntil(

    caches.keys().then((keys) =>

      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))

    )

  );

  self.clients.claim();

});



async function staleWhileRevalidate(request, offlineFallback) {

  const cache = await caches.open(CACHE_NAME);

  const cached = await cache.match(request);

  const network = fetch(request)

    .then((res) => { if (res && res.ok) cache.put(request, res.clone()); return res; })

    .catch(() => null);

  if (cached) return cached;

  const res = await network;

  if (res) return res;

  return offlineFallback ? offlineFallback() : Response.error();

}



self.addEventListener('fetch', (event) => {

  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);



  if (req.mode === 'navigate') {

    event.respondWith((async () => {

      const cache = await caches.open(CACHE_NAME);

      try {

        const res = await fetch(req);

        if (res && res.ok) cache.put('/index.html', res.clone());

        return res;

      } catch (e) {

        const fallback = (await cache.match('/index.html')) || (await cache.match('/'));

        return fallback || Response.error();

      }

    })());

    return;

  }



  if (url.hostname === 'api.alquran.cloud') {

    event.respondWith(staleWhileRevalidate(req, () => new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } })));

    return;

  }



  event.respondWith(staleWhileRevalidate(req));

});
