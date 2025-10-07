// ==========================
// 🧩 ALTI 飲酒タイプ診断 PWA Service Worker
// ==========================

const CACHE_NAME = "alti-drink-check-v3";
const urlsToCache = [
  "index.html",
  "manifest.json",
  "image/icon-192.png",
  "image/icon-512.png",
  "image/slow-emo.png",
  "image/fast-emo.png",
  "image/fast-cool.png",
  "image/slow-cool.png"
];

// --- インストール時にキャッシュ ---
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// --- リクエスト時にキャッシュ or ネットから取得 ---
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(resp => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resp.clone());
            return resp;
          });
        })
      );
    })
  );
});

// --- 古いキャッシュの削除 ---
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});
