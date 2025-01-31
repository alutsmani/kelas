const CACHE_NAME = 'pwa-cache-v1'; // Versi cache tetap sama
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './login.html',
    './logo.png',
    './script.js',
    './style.css',
    './sw.js',

    './gambar/bg.webp',
    './gambar/iconlk.webp',
    './gambar/iconpr.webp',

    './gambar/logo/icon-48x48.png',
    './gambar/logo/icon-796x96.png',
    './gambar/logo/icon-192x192.png',
    './gambar/logo/icon-512x512.png',

    './gambar/ss/ss1.png',
    './gambar/ss/ss2.png',
    './gambar/ss/ss3.png',


    './halaman/halaman.html',
    './halaman/profil.html',
    './halaman/profil.css',
    './halaman/profil.js',

    './script/akun.js',
    './script/asatidz.js',
    './script/fungsi.js',
    './script/fungsiform.js',
    './script/indexedDB.js',
    './script/login.js',
    './script/online.js',
    './script/pencairan.js',
    './script/tombol.js',


    './styles/animasi.css',
    './styles/collapse.css',
    './styles/login.css',
    './styles/ofcanvass.css',
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cache opened:', CACHE_NAME);
                return cache.addAll(ASSETS_TO_CACHE)
                    .then(() => console.log('[Service Worker] Assets cached successfully'))
                    .catch((error) => {
                        console.error('[Service Worker] Error caching assets:', error);
                    });
            })
            .catch((error) => {
                console.error('[Service Worker] Error opening cache:', error);
            })
    );
});


// Activate event - Hapus cache lama dan force update
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            console.log(`[Service Worker] Deleting old cache: ${cache}`);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim(); // Memaksa SW mengambil alih
            })
            .catch((error) => {
                console.error('[Service Worker] Error during activation:', error);
            })
    );
});

// Fetch event - Serve cached assets atau fallback ke network
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ditemukan di cache, gunakan cache
                if (response) {
                    console.log('[Service Worker] Returning cached asset:', event.request.url);
                    return response;
                }

                // Jika tidak ditemukan, fetch dari network
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request).catch(() => {
                    // Jika gagal (misal offline), berikan fallback
                    if (event.request.mode === 'navigate') {
                        return caches.match('/404.html');
                    }
                });
            })
            .catch((error) => {
                console.error('[Service Worker] Fetch error:', error);
            })
    );
});
