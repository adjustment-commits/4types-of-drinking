const CACHE_NAME = "alti-v1";
const urlsToCache = [
  "index.html",
  "manifest.json",
  "image/slow-emo.png",
  "image/fast-cool.png",
  "image/fast-emo.png",
  "image/slow-cool.png",
  "image/icon-192.png",
  "image/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
