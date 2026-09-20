const CACHE_NAME = 'iska-app-v43';

// Senarai lengkap fail tempatan & audio (tanpa tanda '/')
const LOCAL_ASSETS = [
  'index.html',
  'eja.html',
  'bina_ayat.html',
  'kredit.html',
  'ular_huruf_vokal_aeiou.html',
  'game_2_ketuk_tikus_tanah.html',
  'game_lompat_lari.html',
  'game_1_kumpul_huruf.html',
  'manifest.json',
  'bgm.mp3',

  // Gambar latar belakang utama
  'images/bg_pwa.png',

  // Gambar Lembaran Latihan (Set 1 - 4)
  'images/lembaran5_1.png',
  'images/lembaran5_2.png',
  'images/lembaran5_3.png',
  'images/lembaran5_4.png',
  'images/lembaran6_1.png',
  'images/lembaran6_2.png',
  'images/lembaran6_3.png',
  'images/lembaran6_4.png',
  'images/lembaran8_1.png',
  'images/lembaran8_2.png',
  'images/lembaran8_3.png',
  'images/lembaran8_4.png',
  'images/lembaran9_1.png',
  'images/lembaran9_2.png',
  'images/lembaran9_3.png',
  'images/lembaran9_4.png',

  // Gambar Kredit / Penghargaan Guru
  'images/kredit_cikgu_fairuz.png',
  'images/kredit_cikgu_muliati.png',
  'images/kredit_cikgu_nadiah.png',
  'images/kredit_cikgu_alif.png',
  'images/kredit_cikgu_nurin.png',
  'images/kredit_cikgu_chang.png',

  // Audio Sebutan Ayat Penuh Fasa 3 (.mp3)
  'sebutan/faris_tulis_karangan.mp3',
  'sebutan/aina_sapu_lantai.mp3',
  'sebutan/hakim_bawa_beg_sekolah.mp3',
  'sebutan/sara_baca_buku.mp3',
  'sebutan/ibu_masak_nasi.mp3',
  'sebutan/ayah_basuh_kereta.mp3',
  'sebutan/kakak_lipat_baju.mp3',
  'sebutan/adik_susun_kasut.mp3',
  'sebutan/ali_cuci_tangan.mp3',
  'sebutan/mira_potong_kuku.mp3',
  'sebutan/abu_minum_susu.mp3',
  'sebutan/siti_makan_buah.mp3',
  'sebutan/bapa_tanam_cili_di_kebun.mp3',
  'sebutan/abang_siram_pokok_bunga_waktu_petang.mp3',
  'sebutan/ibu_petik_mangga_dengan_berhati_hati.mp3',
  'sebutan/adik_letak_baja_tanaman_supaya_subur.mp3',

  // Audio Sebutan Perkataan Individu & Ralat
  'sebutan/faris.mp3',
  'sebutan/tulis.mp3',
  'sebutan/karangan.mp3',
  'sebutan/aina.mp3',
  'sebutan/sapu.mp3',
  'sebutan/lantai.mp3',
  'sebutan/hakim.mp3',
  'sebutan/bawa.mp3',
  'sebutan/beg_sekolah.mp3',
  'sebutan/sara.mp3',
  'sebutan/baca.mp3',
  'sebutan/buku.mp3',
  'sebutan/Ibu.mp3',
  'sebutan/Masak.mp3',
  'sebutan/Nasi.mp3',
  'sebutan/Ayah.mp3',
  'sebutan/Basuh.mp3',
  'sebutan/Kereta.mp3',
  'sebutan/Kakak.mp3',
  'sebutan/Lipat.mp3',
  'sebutan/Baju.mp3',
  'sebutan/Adik.mp3',
  'sebutan/Susun.mp3',
  'sebutan/Kasut.mp3',
  'sebutan/Ali.mp3',
  'sebutan/Cuci.mp3',
  'sebutan/Tangan.mp3',
  'sebutan/Mira.mp3',
  'sebutan/Potong.mp3',
  'sebutan/Kuku.mp3',
  'sebutan/Abu.mp3',
  'sebutan/Minum.mp3',
  'sebutan/Susu.mp3',
  'sebutan/Siti.mp3',
  'sebutan/Makan.mp3',
  'sebutan/Buah.mp3',
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
  'sebutan/Supaya_subur.mp3',
  'sebutan/Sila_cuba_lagi.mp3',
  'three.min.js'
];

// 1. Pemasangan & Muat Turun Paksa
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[Service Worker v27] Memuat turun semula kesemua aset...');
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
            console.log('[Service Worker] Memadam cache lama:', cache);
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
        // Fon Google (fonts.googleapis.com/fonts.gstatic.com) dimuat tanpa
        // atribut 'crossorigin', jadi ia pulang sebagai respons 'opaque'
        // (status 0) dan bukan 200 - tetap perlu disimpan dalam cache supaya
        // fon boleh dimuat semula ketika luar talian (offline).
        if (!networkResponse || (networkResponse.status !== 200 && networkResponse.type !== 'opaque')) {
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