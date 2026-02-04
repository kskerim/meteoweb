// service worker pour le mode offline et le cache

const CACHE_NAME = "meteo-aura-v1";
const OFFLINE_URL = "/offline.html";

// ressources a mettre en cache immediatement
const PRECACHE_RESOURCES = [
  "/",
  "/favorites",
  "/about",
  "/offline.html",
];

// installation du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_RESOURCES);
    })
  );
  self.skipWaiting();
});

// activation et nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// strategie de fetch: network first, puis cache, puis offline
self.addEventListener("fetch", (event) => {
  // ignorer les requetes non-get
  if (event.request.method !== "GET") return;

  // ignorer les requetes api (on veut toujours des donnees fraiches)
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "offline" }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // mettre en cache les reponses reussies
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(async () => {
        // essayer le cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // pour les pages de navigation, afficher la page offline
        if (event.request.mode === "navigate") {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // sinon retourner une erreur
        return new Response("Offline", { status: 503 });
      })
  );
});
