const CACHE_NAME = 'iska-app-v22';

// Senarai lengkap fail tempatan & audio di dalam direktori sebutan/
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
  'images/lembaran9_1.png',
  'images/lembaran9_2.png',
  'images/lembaran9_3.png',
  'images/lembaran9_4.png',

  // Audio Sebutan Ayat Penuh (.mp3)
  'sebutan/faris_menulis_karangan.mp3',
  'sebutan/aina_sapu_lantai.mp3',
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
  'sebutan/bapa_tanam_cili_di_kebun.mp3',
  'sebutan/abang_siram_pokok_bunga_waktu_petang.mp3',
  'sebutan/ibu_petik_mangga_dengan_berhati_hati.mp3',
  'sebutan/adik_letak_baja_tanaman_supaya_subur.mp3',

  // Audio Sebutan Perkataan Individu Fasa 3
  'sebutan/Faris.mp3',
  'sebutan/Tulis.mp3',
  'sebutan/Karangan.mp3',
  'sebutan/Aina.mp3',
  'sebutan/Sapu.mp3',
  'sebutan/Lantai.mp3',
  'sebutan/Hakim.mp3',
  'sebutan/Bawa.mp3',
  'sebutan/Beg_sekolah.mp3',
  'sebutan/Sara.mp3',
  'sebutan/Baca.mp3',
  'sebutan/Buku.mp3',
  'sebutan/Ibu.mp3',
  'sebutan/Masak.mp3',
  'sebutan/Nasi.mp3',
  'sebutan/Ayah.mp3',
  'sebutan/Basuh.mp3',
  'sebutan/Kereta.mp3',
  'sebutan/Kakak.mp3',
  'sebutan/Lipat.mp3',
  'sebutan/Pakaian.mp3',
  'sebutan/Adik.mp3',
  'sebutan/Susun.mp3',
  'sebutan/Kasut.mp3',
  'sebutan/Rina.mp3',
  'sebutan/Main.mp3',
  'sebutan/Buaian.mp3',
  'sebutan/Amir.mp3',
  'sebutan/Tunggang.mp3',
  'sebutan/Basikal.mp3',
  'sebutan/Hana.mp3',
  'sebutan/Lompat.mp3',
  'sebutan/Tali.mp3',
  'sebutan/Danish.mp3',
  'sebutan/Gelongsor.mp3',
  'sebutan/Bapa.mp3',
  'sebutan/Tanam.mp3',
  'sebutan/Cili.mp3',
  'sebutan/Di_kebun.mp3',
  'sebutan/Abang.mp3',
  'sebutan/Siram.mp3',
  'sebutan/Pokok_bunga.mp3',
  'sebutan/Pada_waktu_petang.mp3',
  'sebutan/Petik.mp3',
  'sebutan/Mangga.mp3',
  'sebutan/Dengan_berhati_hati.mp3',
  'sebutan/Letak.mp3',
  'sebutan/Baja_tanaman.mp3',
  'sebutan/Supaya_subur.mp3'
];

const EXTERNAL_CDN = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// 1. Pemasangan & Muat Turun Paksa
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[Service Worker v22] Memuat turun semula kesemua aset & audio perkataan...');
      for (const asset of LOCAL_ASSETS) {
        try {
          const response = await fetch(asset, { cache: 'reload' });
          if (response.ok) {
            await cache.put(asset, response);
          } else {
            console.warn('[SW Warning] Fail tidak dijumpai di pelayan:', asset);
          }
        } catch (e) {
          console.error('[SW Error] Gagal fetch:', asset, e);
        }
      }
      for (const url of EXTERNAL_CDN) {
        try { await cache.add(url); } catch (e) {}
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. Pengaktifan & Pemadaman Agresif Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Memadam cache lama yang tersangkut:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim().then(() => {
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ action: 'forceReload' }));
        });
      });
    })
  );
});

// 3. Kawalan Fetch & Range Requests
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
              'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/mpeg',
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