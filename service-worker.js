const CACHE_NAME = "alti-cache-v1";
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

// インストール時にキャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("🟢 キャッシュ完了");
      return cache.addAll(urlsToCache);
    })
  );
});

// リクエスト取得時にキャッシュ利用
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 古いキャッシュ削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
