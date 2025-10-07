const CACHE_NAME = "alti-drink-type-v3";
const urlsToCache = [
  "index.html",
  "style.css",
  "main.js",
  "manifest.json",
  "image/icon-192.png",
  "image/icon-512.png",
  "image/slow-emo.png",
  "image/fast-emo.png",
  "image/fast-cool.png",
  "image/slow-cool.png"
];

// ✅ インストール時にキャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ✅ オフライン対応
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// ✅ 古いキャッシュを削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
