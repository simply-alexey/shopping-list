self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("shopping-list").then(cache => {
      // ✅ Added app icons for complete offline caching
      return cache.addAll([
        "./",
        "./index.html",
        "./styles.css",
        "./script.js",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});