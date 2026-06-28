const CACHE_NAME = "smart-ledger-cache-v2";
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "./logo.png"
];

// سروس ورکر کو انسٹال کرنا اور نیا لوگو کیشے میں سیو کرنا
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets including new logo...");
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// پرانے کیشے کو صاف کرنا تاکہ نیا لوگو فوراً موبائل پر اپڈیٹ ہو جائے
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Clearing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// آف لائن کام کرنے کے لیے فائلیں لوڈ کرنا
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
