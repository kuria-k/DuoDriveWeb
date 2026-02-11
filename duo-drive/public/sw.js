const CACHE_NAME = 'identifyafrica-pwa-v1';
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/android-icon-36x36.png',
  '/android-icon-48x48.png',
  '/android-icon-72x72.png',
  '/android-icon-96x96.png',
  '/android-icon-144x144.png',
  '/android-icon-192x192.png',
  // Removed CSS/font paths not in public/
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .catch(() => caches.match('/offline.html'));
      })
    );
    return;
  }

  // Runtime caching for images, CSS, and JS
  if (
    event.request.destination === 'image' ||
    event.request.destination === 'style' ||
    event.request.destination === 'script'
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(networkResponse => {
          // Only cache successful responses
          if (!networkResponse || !networkResponse.ok) return networkResponse;
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => undefined);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => undefined);
    })
  );
}); 

