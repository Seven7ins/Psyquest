const CACHE_NAME = "psyquest-cache-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./backend-config.js",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const pathname = requestUrl.pathname;
  const isRuntimeConfigFile = pathname.endsWith("/firebase-config.js");
  const isApiRequest = pathname.includes("/api/");
  const shouldSkipCache =
    pathname.endsWith("/firebase-config.js") ||
    pathname.endsWith("/backend-config.js") ||
    pathname.endsWith("/service-worker.js");

  if (isSameOrigin) {
    if (isApiRequest) {
      event.respondWith(fetch(request, { cache: "no-store" }));
      return;
    }

    if (isRuntimeConfigFile) {
      event.respondWith(
        fetch(request, { cache: "no-store" }).catch(() =>
          caches
            .match(request)
            .then(
              (cached) =>
                cached ||
                new Response("window.PSYQUEST_FIREBASE_CONFIG = {};", {
                  headers: { "Content-Type": "application/javascript" }
                })
            )
        )
      );
      return;
    }

    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request)
          .then((response) => {
            const responseClone = response.clone();
            if (!shouldSkipCache) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => caches.match("./index.html"));
      })
    );
    return;
  }

  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then((cached) => cached || caches.match("./index.html"))
    )
  );
});
