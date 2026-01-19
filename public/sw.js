const CACHE_NAME = 'ladiva-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Cache strategy: Stale-while-revalidate for uploads, Network First for API, Cache First for static
    const url = new URL(event.request.url);

    // 1. API Calls -> Network only (don't cache dynamic data)
    if (url.pathname.startsWith('/api')) {
        return;
    }

    // 2. Uploads/Images -> Cache first, fall back to network
    if (url.pathname.startsWith('/uploads') || url.pathname.match(/\.(png|jpg|jpeg|svg|ico)$/)) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchRes) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchRes.clone());
                        return fetchRes;
                    });
                });
            })
        );
        return;
    }

    // 3. Default -> Network first, fall back to cache
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
