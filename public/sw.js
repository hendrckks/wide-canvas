const CACHE_NAME = 'wide-canvas-cache-v1';
const CACHE_URLS = [
  '/shotfilm.mp4',
  '/trailer.mp4',
  '/master1.png',
  '/master2.png',
  '/advanced.png',
  '/boat.webp',
  '/boats.webp',
  '/ice.jpg',
  '/landscape.webp',
  '/waves.jpg',
  '/wc.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_URLS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image' || 
      event.request.url.endsWith('.mp4') || 
      event.request.url.endsWith('.webm')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});