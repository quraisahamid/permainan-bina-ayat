const CACHE_NAME = 'iska-app-v10';

// Senarai lengkap fail tempatan untuk disimpan ke dalam cache peranti (100% Offline)
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

  // Gambar Lembaran Latihan (Set 1 - 4)
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

  // Fail Audio Sebutan Rakaman .mp3
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

// Pustaka CDN Luaran (Tailwind & Three.js 3D Engine)
const EXTERNAL_CDN = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// 1. Install Event: Memuat turun dan menyimpan aset baharu versi v10
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[Service Worker v10] Mengemas kini aset offline...');
      
      // Simpan fail tempatan
      for (const asset of LOCAL_ASSETS) {
        try {
          await cache.add(new Request(asset, { cache: 'reload' }));
        } catch (e) {
          console.error('[SW] Gagal menyimpan aset tempatan:', asset, e);
        }
      }

      // Simpan Pustaka CDN
      for (const url of EXTERNAL_CDN) {
        try {
          await cache.add(url);
        } catch (e) {
          console.log('[SW] Pustaka CDN tiada sambungan internet:', url);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Membersihkan cache versi lama (v9 dan sebelumnya)
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

// 3. Fetch Event: Menyokong mod offline dan penyiapan Range Requests untuk iOS WebKit / Android Audio
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(async (cachedResponse) => {
      if (cachedResponse) {
        // Pengendalian Khas Audio Range Request (Wajib untuk Safari iOS & Chrome Mobile)
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

      // Ambil dari rangkaian sekiranya tiada dalam cache tempatan
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

// 4. Mesej skipWaiting untuk muat semula automatik
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});