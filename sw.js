// TUKAR NAMA VERSI INI SETIAP KALI UPDATE terkini adalah v9
const CACHE_NAME = 'bm-pwa-v9'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './eja.html',
  './bina_ayat.html',
  './manifest.json',
  './bgm.mp3',
  './images/lembaran5_1.png', './images/lembaran5_2.png', './images/lembaran5_3.png', './images/lembaran5_4.png',
  './images/lembaran6_1.png', './images/lembaran6_2.png', './images/lembaran6_3.png', './images/lembaran6_4.png',
  './images/lembaran7_1.png', './images/lembaran7_2.png', './images/lembaran7_3.png', './images/lembaran7_4.png',
  './images/lembaran8_1.png', './images/lembaran8_2.png', './images/lembaran8_3.png', './images/lembaran8_4.png',
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

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// AKTIVASI: Padam SEMUA cache lama di peranti pengguna
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Memadam cache lama secara paksa:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// NETWORK FIRST STRATEGY untuk navigasi HTML
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