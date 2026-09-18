const CACHE_NAME = 'bina-ayat-v1';
const urlsToCache = [
  './',
  './index.html',
  './eja.html',
  './manifest.json',
  './bgm.mp3',
  './images/lembaran1_1.png',
  './images/lembaran1_2.png',
  './images/lembaran1_3.png',
  './images/lembaran1_4.png',
  './images/lembaran2_1.png',
  './images/lembaran2_2.png',
  './images/lembaran2_3.png',
  './images/lembaran2_4.png',
  './images/lembaran3_1.png',
  './images/lembaran3_2.png',
  './images/lembaran3_3.png',
  './images/lembaran3_4.png',
  './images/lembaran4_1.png',
  './images/lembaran4_2.png',
  './images/lembaran4_3.png',
  './images/lembaran4_4.png',
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
  './images/lembaran8_4.png'
];

// Peringkat Menyimpan Aset (Install)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Peringkat Mengambil Aset apabila Offline (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});