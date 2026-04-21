import { store } from '../state/store.js';
import { saveWishlist } from '../storage/localStorageService.js';
import { renderEmptyState } from '../components/emptyState.js';
import { createPokemonCard } from '../components/pokemonCard.js';
import { capitalize, formatDate } from '../utils/helpers.js';

function extraContent(item) {
  return `
    <p><strong>Prioridad:</strong> ${item.priority}</p>
    <p><strong>Etiqueta:</strong> ${capitalize(item.tag)}</p>
    <p><strong>Nota:</strong> ${item.note || 'Sin nota'}</p>
    <p class="muted">Agregado: ${formatDate(item.addedAt)}</p>
  `;
}

function bindWishlistEvents(app) {
  app.querySelectorAll('[data-remove-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.removeId);
      store.wishlist = store.wishlist.filter((item) => item.id !== id);
      saveWishlist(store.wishlist);
      renderWishlistView(app);
    });
  });
}

export function renderWishlistView(app) {
  if (!store.wishlist.length) {
    app.innerHTML = renderEmptyState('Tu lista de deseos está vacía', 'Todavía no agregaste ningún Pokémon a tu wishlist.');
    return;
  }

  const cards = store.wishlist.map((item) => `
    <div>
      ${createPokemonCard(item, { extra: extraContent(item) })}
      <div style="margin-top:.5rem; display:flex; gap:.5rem; flex-wrap:wrap;">
        <button class="btn btn-danger" data-remove-id="${item.id}">Eliminar</button>
      </div>
    </div>
  `).join('');

  app.innerHTML = `
    <section class="section-card">
      <div class="section-header">
        <div>
          <p class="muted">Persistencia con localStorage</p>
          <h1>Lista de deseos</h1>
        </div>
      </div>
      <div class="cards-grid">${cards}</div>
    </section>
  `;

  bindWishlistEvents(app);
}
