const CACHE_NAME = 'pokeexplorer-shell-v2';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',

  './css/reset.css',
  './css/variables.css',
  './css/main.css',
  './css/layout.css',
  './css/components.css',
  './css/responsive.css',

  './js/app.js',
  './js/router.js',

  './js/api/pokemonApi.js',

  './js/components/emptyState.js',
  './js/components/loader.js',
  './js/components/modal.js',
  './js/components/navbar.js',
  './js/components/pagination.js',
  './js/components/pokemonCard.js',

  './js/state/store.js',

  './js/storage/localStorageService.js',

  './js/utils/formatters.js',
  './js/utils/helpers.js',

  './js/views/contactView.js',
  './js/views/detailView.js',
  './js/views/historyView.js',
  './js/views/homeView.js',
  './js/views/searchView.js',
  './js/views/wishlistView.js',

  './icons/pikachu192.png',
  './icons/pokelogo-convertido-a-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});