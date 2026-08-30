// TUKAR NAMA VERSI INI (contoh: bm-pwa-v2) SETIAP KALI ANDA KEMASKINI KOD DI GITHUB
const CACHE_NAME = 'bm-pwa-v2'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './eja.html',
  './manifest.json',
  './bgm.mp3',
  // Gambar Lembaran 1 hingga 8
  './images/lembaran1_1.png', './images/lembaran1_2.png', './images/lembaran1_3.png', './images/lembaran1_4.png',
  './images/lembaran2_1.png', './images/lembaran2_2.png', './images/lembaran2_3.png', './images/lembaran2_4.png',
  './images/lembaran3_1.png', './images/lembaran3_2.png', './images/lembaran3_3.png', './images/lembaran3_4.png',
  './images/lembaran4_1.png', './images/lembaran4_2.png', './images/lembaran4_3.png', './images/lembaran4_4.png',
  './images/lembaran5_1.png', './images/lembaran5_2.png', './images/lembaran5_3.png', './images/lembaran5_4.png',
  './images/lembaran6_1.png', './images/lembaran6_2.png', './images/lembaran6_3.png', './images/lembaran6_4.png',
  './images/lembaran7_1.png', './images/lembaran7_2.png', './images/lembaran7_3.png', './images/lembaran7_4.png',
  './images/lembaran8_1.png', './images/lembaran8_2.png', './images/lembaran8_3.png', './images/lembaran8_4.png',
  // Fail audio tempatan (jika ada tukar ke .ogg, pastikan nama sambungan di sini juga ditukar)
  './sebutan/melintas.mp3', './sebutan/memakai.mp3', './sebutan/menanam.mp3', './sebutan/membaca.mp3',
  './sebutan/menulis.mp3', './sebutan/menyapu.mp3', './sebutan/membantu.mp3', './sebutan/memasak.mp3',
  './sebutan/membasuh.mp3', './sebutan/melipat.mp3', './sebutan/menyusun.mp3', './sebutan/bermain.mp3',
  './sebutan/menunggang.mp3', './sebutan/melompat.mp3', './sebutan/mencuci.mp3', './sebutan/memotong.mp3',
  './sebutan/komputer.mp3', './sebutan/lantai.mp3', './sebutan/pakaian.mp3', './sebutan/basikal.mp3'
];

// 1. Pemasangan Service Worker & Simpan Cache
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Paksa Service Worker baharu untuk aktif dengan segera
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan fail ke dalam Cache PWA...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Pembersihan Cache Lama & Ambil Alih Kawalan
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Memadam cache PWA lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Mengambil alih halaman tanpa tunggu refresh manual
  );
});

// 3. Mengambil Fail daripada Cache (Offline First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// 4. Menerima Mesej daripada HTML untuk Aktivasi Pantas
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});