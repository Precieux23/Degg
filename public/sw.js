const CACHE_NAME = "degg-v1";
const OFFLINE_PHRASES = [
  "Où est le stade ?",
  "Je suis perdu",
  "J'ai besoin d'aide",
  "Appelez une ambulance",
  "Bonjour",
  "Merci beaucoup",
  "Où sont les toilettes ?",
  "De l'eau s'il vous plaît",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/manifest.json"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});