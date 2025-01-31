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
    './gambar/logo/icon-96x96.png',
    './gambar/logo/icon-192x192.png',
    './gambar/logo/icon-512x512.png',

    './gambar/ss/ss1.png',
    './gambar/ss/ss2.png',
    './gambar/ss/ss3.png',


    './halaman/halaman.html',
    './halaman/profil.html',
    './halaman/profil.css',
    './halaman/profil.js',

    './scripts/akun.js',
    './scripts/asatidz.js',
    './scripts/fungsi.js',
    './scripts/fungsiform.js',
    './scripts/indexedDB.js',
    './scripts/login.js',
    './scripts/online.js',
    './scripts/pencarian.js',
    './scripts/tombol.js',


    './styles/animasi.css',
    './styles/collapse.css',
    './styles/login.css',
    './styles/ofcanvass.css',
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[Service Worker] Cache opened:', CACHE_NAME);
            try {
                const cachePromises = ASSETS_TO_CACHE.map(async (asset) => {
                    try {
                        const response = await fetch(asset, { cache: 'no-store' });
                        if (!response.ok) {
                            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
                        }
                        return cache.put(asset, response);
                    } catch (err) {
                        console.error(`[Service Worker] Failed to cache ${asset}:`, err);
                    }
                });
                await Promise.all(cachePromises);
                console.log('[Service Worker] All assets cached successfully');
            } catch (err) {
                console.error('[Service Worker] Error during caching:', err);
            }
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


function reloadCache() {
    caches.open(CACHE_NAME).then((cache) => {
        cache.keys().then((keys) => {
            keys.forEach((request) => {
                cache.delete(request);
            });
        });
    });
    location.reload();
}

function reinstallCache() {
    caches.open(CACHE_NAME).then((cache) => {
        cache.keys().then((keys) => {
            keys.forEach((request) => {
                cache.delete(request);
            });
        });
    });
    self.clients.openWindow('/');
}

function updateCache() {
    reloadCache();
    reinstallCache();
}

self.addEventListener('message', (event) => {
    if (event.data === 'reload') {
        reloadCache();
    } else if (event.data === 'reinstall') {
        reinstallCache();
    } else if (event.data === 'update') {
        updateCache();
    }
});
