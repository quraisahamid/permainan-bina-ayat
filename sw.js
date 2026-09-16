const CACHE_NAME = 'iska-app-v3';

// Senarai fail yang disimpan untuk mod offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './eja.html',
  './bina_ayat.html',
  './ular_huruf_vokal_aeiou.html',
  './game_2_ketuk_tikus_tanah.html',
  './game_lompat_lari.html',
  './game_1_kumpul_huruf.html',
  './manifest.json',
  './bgm.mp3',

  // Pustaka Luaran (CDN Cache untuk Akses Offline 3D & Styling)
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Mali:wght@600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Poppins:wght@600;700;800&display=swap',

  // Fail Imej Lembaran Latihan
  './images/lembaran5_1.png',
  './images/lembaran5_2.png',
  './images/lembaran5_3.png',
  './images/lembaran5_4.png',
  './images/lembaran6_1.png',
  './images/lembaran6_2.png',
  './images/lembaran6_3.png',
  './images/lembaran6_4.png',
  './images/lembaran7_1.png',
  './images/lembaran7_2.png',
  './images/lembaran7_3.png',
  './images/lembaran7_4.png',
  './images/lembaran8_1.png',
  './images/lembaran8_2.png',
  './images/lembaran8_3.png',
  './images/lembaran8_4.png',

  // Fail Audio Sebutan Rakaman
  './sebutan/faris_menulis_karangan.mp3',
  './sebutan/aina_menyapu_lantai.mp3',
  './sebutan/hakim_membawa_beg_sekolah.mp3',
  './sebutan/sara_membaca_buku.mp3',
  './sebutan/ibu_memasak_nasi.mp3',
  './sebutan/ayah_membasuh_kereta.mp3',
  './sebutan/kakak_melipat_pakaian.mp3',
  './sebutan/adik_menyusun_kasut.mp3',
  './sebutan/rina_bermain_buaian.mp3',
  './sebutan/amir_menunggang_basikal.mp3',
  './sebutan/hana_melompat_tali.mp3',
  './sebutan/danish_bermain_gelongsor.mp3',
  './sebutan/ali_mencuci_tangan.mp3',
  './sebutan/mira_memotong_kuku.mp3',
  './sebutan/abu_minum_susu.mp3',
  './sebutan/siti_makan_buah.mp3'
];

// 1. Peringkat Pemasangan (Install Event): Memasukkan fail ke dalam Storan Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Memuat turun dan menyimpan aset...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Peringkat Pengaktifan (Activate Event): Membersihkan cache versi lama jika ada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Membersihkan cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Peringkat Pengambilan Data (Fetch Event): Menggunakan Cache Dulu (Cache First Strategy)
self.addEventListener('fetch', (event) => {
  // Abaikan permintaan bukan GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Kembalikan maklumat dari storan cache jika wujud
        return cachedResponse;
      }

      // Jika tiada dalam cache, ambil dari rangkaian internet dan simpan ke cache secara dinamik
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Paparan ganti jika luput rangkaian internet untuk HTML
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// 4. Menerima mesej untuk kemaskini automatik (skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});