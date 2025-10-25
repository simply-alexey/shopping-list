self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("shopping-list").then(cache => {
      return cache.addAll(["./","./index.html","./styles.css","./script.js","./manifest.json"]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});