const WISHLIST_KEY = 'pokeexplorer_wishlist';
const HISTORY_KEY = 'pokeexplorer_history';

function readJson(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getWishlist() {
  return readJson(WISHLIST_KEY);
}

export function saveWishlist(list) {
  writeJson(WISHLIST_KEY, list);
}

export function getHistory() {
  return readJson(HISTORY_KEY);
}

export function saveHistory(list) {
  writeJson(HISTORY_KEY, list);
}
