const CACHE_NAME = 'iska-app-v5';

// Senarai fail tempatan (Format diselaraskan tanpa './' untuk padanan offline)
const LOCAL_ASSETS = [
  '/',
  'index.html',
  'eja.html',
  'bina_ayat.html',
  'ular_huruf_vokal_aeiou.html',
  'game_2_ketuk_tikus_tanah.html',
  'game_lompat_lari.html',
  'game_1_kumpul_huruf.html',
  'manifest.json',
  'bgm.mp3',

  // Gambar Lembaran
  'images/lembaran5_1.png',
  'images/lembaran5_2.png',
  'images/lembaran5_3.png',
  'images/lembaran5_4.png',
  'images/lembaran6_1.png',
  'images/lembaran6_2.png',
  'images/lembaran6_3.png',
  'images/lembaran6_4.png',
  'images/lembaran7_1.png',
  'images/lembaran7_2.png',
  'images/lembaran7_3.png',
  'images/lembaran7_4.png',
  'images/lembaran8_1.png',
  'images/lembaran8_2.png',
  'images/lembaran8_3.png',
  'images/lembaran8_4.png',

  // Audio Sebutan Rakaman .mp3
  'sebutan/faris_menulis_karangan.mp3',
  'sebutan/aina_menyapu_lantai.mp3',
  'sebutan/hakim_membawa_beg_sekolah.mp3',
  'sebutan/sara_membaca_buku.mp3',
  'sebutan/ibu_memasak_nasi.mp3',
  'sebutan/ayah_membasuh_kereta.mp3',
  'sebutan/kakak_melipat_pakaian.mp3',
  'sebutan/adik_menyusun_kasut.mp3',
  'sebutan/rina_bermain_buaian.mp3',
  'sebutan/amir_menunggang_basikal.mp3',
  'sebutan/hana_melompat_tali.mp3',
  'sebutan/danish_bermain_gelongsor.mp3',
  'sebutan/ali_mencuci_tangan.mp3',
  'sebutan/mira_memotong_kuku.mp3',
  'sebutan/abu_minum_susu.mp3',
  'sebutan/siti_makan_buah.mp3'
];

const EXTERNAL_CDN = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// 1. Install & Cache All Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Memuat turun & menyimpan fail offline...');
      
      // Simpan aset tempatan
      for (const asset of LOCAL_ASSETS) {
        try {
          await cache.add(new Request(asset, { cache: 'reload' }));
        } catch (e) {
          console.error('[SW] Gagal Simpan Asset:', asset, e);
        }
      }

      // Simpan Pustaka CDN
      for (const url of EXTERNAL_CDN) {
        try {
          await cache.add(url);
        } catch (e) {
          console.log('[SW] CDN tiada capaian:', url);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate & Clean Old Cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Membersihkan cache versi lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event Handling (Menyokong Audio Range Requests secara Offline)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(async (cachedResponse) => {
      // Jika fail ditemui dalam Cache
      if (cachedResponse) {
        // Pengendalian Khas untuk Audio Range Request (Dikehendaki oleh Safari & Chrome Offline Audio)
        if (event.request.headers.has('range')) {
          const blob = await cachedResponse.blob();
          const bytes = event.request.headers.get('range').replace(/bytes=/, "").split("-");
          const start = parseInt(bytes[0], 10);
          const end = bytes[1] ? parseInt(bytes[1], 10) : blob.size - 1;
          const chunk = blob.slice(start, end + 1);

          return new Response(chunk, {
            status: 206,
            statusText: 'Partial Content',
            headers: new Headers({
              'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mpeg',
              'Content-Range': `bytes ${start}-${end}/${blob.size}`,
              'Content-Length': chunk.size,
              'Accept-Ranges': 'bytes'
            })
          });
        }
        return cachedResponse;
      }

      // Jika tiada dalam cache, ambil dari internet
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('index.html');
        }
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});