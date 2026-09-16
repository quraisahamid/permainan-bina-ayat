const CACHE_NAME = 'iska-app-v20';

// Senarai lengkap fail tempatan & audio .m4a berhuruf besar di depan untuk 100% Offline
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

  // Audio Sebutan Fasa 3 (Ayat Penuh .mp3)
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
  'sebutan/siti_makan_buah.mp3',

  // Audio Sebutan Fasa 2 (Suku Kata & Perkataan .m4a - Huruf Depan Besar)
  'sebutan/Cu.m4a', 'sebutan/Ci.m4a', 'sebutan/Ma.m4a', 'sebutan/Sak.m4a',
  'sebutan/Lin.m4a', 'sebutan/Tas.m4a', 'sebutan/Sa.m4a', 'sebutan/Pu.m4a',
  'sebutan/Mi.m4a', 'sebutan/Num.m4a', 'sebutan/Li.m4a', 'sebutan/Pat.m4a',
  'sebutan/Ba.m4a', 'sebutan/Suh.m4a', 'sebutan/Po.m4a', 'sebutan/Tong.m4a',
  'sebutan/Su.m4a', 'sebutan/Sun.m4a', 'sebutan/Tu.m4a', 'sebutan/Lis.m4a',

  'sebutan/Cuci.m4a', 'sebutan/Masak.m4a', 'sebutan/Lintas.m4a', 'sebutan/Sapu.m4a',
  'sebutan/Minum.m4a', 'sebutan/Lipat.m4a', 'sebutan/Basuh.m4a', 'sebutan/Potong.m4a',
  'sebutan/Susun.m4a', 'sebutan/Tulis.m4a', 'sebutan/Cuba_lagi.m4a'
];

const EXTERNAL_CDN = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[Service Worker v20] Menyimpan aset & fail .m4a berhuruf besar offline...');
      for (const asset of LOCAL_ASSETS) {
        try {
          const response = await fetch(asset, { cache: 'reload' });
          if (response.ok) await cache.put(asset, response);
        } catch (e) {
          console.error('[SW Error] Gagal simpan:', asset, e);
        }
      }
      for (const url of EXTERNAL_CDN) {
        try { await cache.add(url); } catch (e) {}
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(async (cachedResponse) => {
      if (cachedResponse) {
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
              'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mp4',
              'Content-Range': `bytes ${start}-${end}/${blob.size}`,
              'Content-Length': chunk.size,
              'Accept-Ranges': 'bytes'
            })
          });
        }
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;
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