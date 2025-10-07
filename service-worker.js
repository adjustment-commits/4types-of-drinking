const CACHE_NAME = "alti-drink-check-v1.0";
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

// 🔹 インストール時にキャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 🔹 リクエスト時にキャッシュを優先
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 🔹 古いキャッシュを削除
self.addEventListener("activate", event => {
  const whitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!whitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
