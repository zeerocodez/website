/**
 * Zeerocodes Service Worker (v1.0)
 * Offline lesson and blueprint cache for low-bandwidth environments.
 */

const CACHE_NAME = 'zeerocodes-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/logo.png',
  '/js/toast.js',
  '/js/db.js',
  '/js/auth.js',
  '/js/emails.js',
  '/js/notifications.js',
  '/js/payments.js',
  '/js/lms.js',
  '/js/blog.js',
  '/js/admin.js',
  '/js/studio.js',
  '/js/router.js',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
