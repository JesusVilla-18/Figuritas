const CACHE = "album-cache-v9";

self.addEventListener("install", e=>{
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache=>{
      return cache.addAll([
        "./",
        "index.html"
      ]);
    })
  );
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(
        keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", e=>{

  const url = e.request.url;

  // 🔥 NO CACHEAR API (esto era tu bug)
  if(url.includes("script.google.com")){
    return e.respondWith(fetch(e.request));
  }

  // cache-first para estáticos
  e.respondWith(
    caches.match(e.request).then(res=>{
      return res || fetch(e.request);
    })
  );
});
