import { router } from './router.js';
import { setupNavbar } from './components/navbar.js';
import { getWishlist, getHistory } from './storage/localStorageService.js';
import { store } from './state/store.js';

function loadPersistedData() {
  store.wishlist = getWishlist();
  store.history = getHistory();
}

function setupRouter() {
  window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', router);
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

loadPersistedData();
setupNavbar();
setupRouter();
registerServiceWorker();
