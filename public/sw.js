/**
 * Service Worker - Pharmacies de Garde au Togo
 * Gestion du cache hors-ligne et des requêtes réseau
 */

const CACHE_NAME = 'pharmas-togo-v1';
const STATIC_CACHE = 'pharmas-static-v1';

// Ressources à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// URL de l'API pharmacies
const API_PHARMACIES = '/api/pharmacies';
const API_CLEAR_CACHE = '/api/pharmacies/clear-cache';

// Durée de validité du cache API (30 minutes)
const API_CACHE_TTL = 30 * 60 * 1000;

/**
 * Événement d'installation : mise en cache des assets statiques
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/**
 * Événement d'activation : nettoyage des anciens caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

/**
 * Événement fetch : stratégie réseau d'abord, avec fallback cache
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Pour les requêtes API pharmacies : réseau d'abord, cache fallback
  if (url.pathname === API_PHARMACIES && event.request.method === 'GET') {
    event.respondWith(networkFirstWithCache(event.request));
    return;
  }

  // Pour les requêtes de clear cache : toujours réseau
  if (url.pathname === API_CLEAR_CACHE) {
    event.respondWith(
      fetch(event.request).then(async (response) => {
        // Vider aussi le cache API local du service worker
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(API_PHARMACIES);
        return response;
      })
    );
    return;
  }

  // Pour les assets statiques : cache d'abord, réseau fallback
  event.respondWith(cacheFirstWithNetwork(event.request));
});

/**
 * Stratégie : Réseau d'abord avec cache fallback
 * Utilisée pour les données API pour avoir les infos les plus récentes
 */
async function networkFirstWithCache(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Mettre en cache la réponse réseau
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    // En cas d'erreur réseau, essayer le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Hors ligne - données en cache indisponibles',
        pharmacies: [],
        totalFound: 0,
        scrapedAt: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Stratégie : Cache d'abord avec réseau fallback
 * Utilisée pour les assets statiques
 */
async function cacheFirstWithNetwork(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Hors ligne', { status: 503 });
  }
}
