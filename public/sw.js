const CACHE_NAME = 'techamat-business-suite-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/main.js' // Vite bundles the app into main.js
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});