const CACHE_NAME = "alti-drinking-v3";
const urlsToCache = [
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "./image/icon-192.png",
  "./image/icon-512.png",
  "./image/splash-1170x2532.png",
  "./image/splash-2048x2732.png",
  "./image/slow-emo.png",
  "./image/fast-emo.png",
  "./image/slow-cool.png",
  "./image/fast-cool.png"
];

// インストール時にキャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// オフライン時のフェッチ処理
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
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});
