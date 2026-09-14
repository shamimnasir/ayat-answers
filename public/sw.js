const CACHE_NAME = 'alquran-v4';
const STATIC_ASSETS = ['/', '/index.html', '/icon-192.png', '/icon-512.png', '/manifest.json'];

// The bundled Quran text. Precached so the entire Quran is readable with no
// network, including on a first launch that never reaches the API.
// ~1.05 MB gzipped across the four editions.
const QURAN_DATA = [
  '/quran/surah-index.json',
  '/quran/quran-arabic.json',
  '/quran/quran-en.json',
  '/quran/quran-bn.json',
  '/quran/quran-translit.json',
];

// Vite emits hashed filenames, so the build assets can't be listed statically.
// Read them out of index.html at install time instead.
async function precacheBuildAssets(cache) {
  try {
    const res = await fetch('/index.html', { cache: 'reload' });
    if (!res.ok) return;
    const html = await res.text();
    const re = new RegExp('(?:src|href)="(/assets/[^"]+)"', 'g');
    const urls = [...html.matchAll(re)].map((m) => m[1]);
    await Promise.all(urls.map((u) => cache.add(u).catch(() => {})));
  } catch (e) {
    /* offline at install time - runtime caching will pick these up later */
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_ASSETS).catch(() => {});
    await precacheBuildAssets(cache);
    // Individually, so one failure doesn't abort the whole install.
    await Promise.all(QURAN_DATA.map((u) => cache.add(u).catch(() => {})));
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

// Serve from cache immediately, refresh in the background.
async function staleWhileRevalidate(request, offlineFallback) {
  const cache = await caches.open(CACHE_NAME);
  // ignoreVary: entries are precached by URL with no Origin header, while the
  // browser sends one for CORS subrequests (module scripts). Without this a
  // `Vary: Origin` or `Vary: Accept-Encoding` response never matches and the
  // app silently fails offline.
  const cached = await cache.match(request, { ignoreVary: true });
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

  // App shell: network-first so updates land, cached index.html when offline.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put('/index.html', res.clone());
        return res;
      } catch (e) {
        const fallback = (await cache.match('/index.html', { ignoreVary: true }))
          || (await cache.match('/', { ignoreVary: true }));
        return fallback || Response.error();
      }
    })());
    return;
  }

  // Bundled Quran text is immutable for a given deploy - always prefer the
  // cache and don't spend a network round trip revalidating several MB.
  if (url.origin === self.location.origin && url.pathname.startsWith('/quran/')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req, { ignoreVary: true });
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        return Response.error();
      }
    })());
    return;
  }

  if (url.hostname === 'api.alquran.cloud') {
    event.respondWith(staleWhileRevalidate(req, () =>
      new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } })
    ));
    return;
  }

  event.respondWith(staleWhileRevalidate(req));
});
