// Service Worker - cache les fichiers nécessaires pour une expérience hors ligne
const CACHE_NAME = 'study-tracker-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/src/index.js',
    '/assets/logo.png',
    // Ajoute d'autres ressources nécessaires à la mise en cache
];

// Installation du service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interception des requêtes et gestion du cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Réponse en cache
            }
            return fetch(event.request); // Réponse réseau si non en cache
        })
    );
});
