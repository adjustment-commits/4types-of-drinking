const CACHE_NAME = "alti-drink-v1";
const urlsToCache = [
  "index.html",
  "manifest.json",
  "service-worker.js",
  "image/icon-192.png",
  "image/icon-512.png",
  "image/slow-emo.png",
  "image/fast-emo.png",
  "image/fast-cool.png",
  "image/slow-cool.png"
];

// 初回インストール時にキャッシュ登録
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log("✅ Service Worker: Installed");
});

// リクエスト時にキャッシュ or ネットワーク
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 新しいバージョンのキャッシュに更新
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  console.log("🆕 Service Worker: Activated");
});
