// TUKAR NAMA VERSI INI SETIAP KALI UPDATE (versi ke-5')
const CACHE_NAME = 'bm-pwa-v5'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './eja.html',
  './manifest.json',
  './bgm.mp3',
  './images/lembaran1_1.png', './images/lembaran1_2.png', './images/lembaran1_3.png', './images/lembaran1_4.png',
  './images/lembaran2_1.png', './images/lembaran2_2.png', './images/lembaran2_3.png', './images/lembaran2_4.png',
  './images/lembaran3_1.png', './images/lembaran3_2.png', './images/lembaran3_3.png', './images/lembaran3_4.png',
  './images/lembaran4_1.png', './images/lembaran4_2.png', './images/lembaran4_3.png', './images/lembaran4_4.png',
  './images/lembaran5_1.png', './images/lembaran5_2.png', './images/lembaran5_3.png', './images/lembaran5_4.png',
  './images/lembaran6_1.png', './images/lembaran6_2.png', './images/lembaran6_3.png', './images/lembaran6_4.png',
  './images/lembaran7_1.png', './images/lembaran7_2.png', './images/lembaran7_3.png', './images/lembaran7_4.png',
  './images/lembaran8_1.png', './images/lembaran8_2.png', './images/lembaran8_3.png', './images/lembaran8_4.png',
  './sebutan/melintas.mp3', './sebutan/memakai.mp3', './sebutan/menanam.mp3', './sebutan/membaca.mp3',
  './sebutan/menulis.mp3', './sebutan/menyapu.mp3', './sebutan/membantu.mp3', './sebutan/memasak.mp3',
  './sebutan/membasuh.mp3', './sebutan/melipat.mp3', './sebutan/menyusun.mp3', './sebutan/bermain.mp3',
  './sebutan/menunggang.mp3', './sebutan/melompat.mp3', './sebutan/mencuci.mp3', './sebutan/memotong.mp3',
  './sebutan/komputer.mp3', './sebutan/lantai.mp3', './sebutan/pakaian.mp3', './sebutan/basikal.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// AKTIVASI: Padam SEMUA cache lama di peranti pengguna tanpa syarat
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Jika nama cache tidak sama dengan CACHE_NAME semasa, PADAM TERUS
          if (cache !== CACHE_NAME) {
            console.log('Memadam cache lama secara paksa:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// NETWORK FIRST STRATEGY untuk HTML (Pengguna iOS/Android sentiasa dapat versi terkini jika online)
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});