import { store } from '../state/store.js';
import { saveWishlist } from '../storage/localStorageService.js';
import { renderEmptyState } from '../components/emptyState.js';
import { capitalize } from '../utils/helpers.js';
import { formatPokemonNumber } from '../utils/formatters.js';

function createTeamCard(pokemon) {
  const types = (pokemon.types || [])
    .map((type) => `<span class="badge">${capitalize(type)}</span>`)
    .join('');

  return `
    <article class="pokemon-card">
      <div class="pokemon-card-image">
        <img src="${pokemon.image}" alt="${capitalize(pokemon.name)}" />
      </div>

      <div class="pokemon-card-body">
        <p class="muted">${formatPokemonNumber(pokemon.id)}</p>
        <h3>${capitalize(pokemon.name)}</h3>
        <div class="badges-row">${types}</div>
      </div>

      <div class="pokemon-card-actions">
        <a class="btn btn-secondary" href="#/detail/${pokemon.id}">Ver detalle</a>
        <button
          class="btn btn-primary remove-team-btn"
          type="button"
          data-id="${pokemon.id}"
        >
          Quitar del equipo
        </button>
      </div>
    </article>
  `;
}

function bindRemoveButtons(app) {
  const buttons = app.querySelectorAll('.remove-team-btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);

      store.wishlist = store.wishlist.filter((pokemon) => pokemon.id !== id);
      saveWishlist(store.wishlist);

      renderWishlistView(app);
    });
  });
}

export function renderWishlistView(app) {
  const team = store.wishlist || [];
  const count = team.length;

  if (!count) {
    app.innerHTML = `
      <section class="section-card">
        <div class="section-header">
          <div>
            <p class="muted">Equipo</p>
            <h1>Mi equipo Pokémon</h1>
          </div>
        </div>

        ${renderEmptyState(
          'Todavía no agregaste Pokémon a tu equipo.',
          'Explorá la búsqueda, entrá al detalle de un Pokémon y sumalo a tu equipo ideal.'
        )}

        <div class="hero-actions">
          <a class="btn btn-primary" href="#/search">Ir a búsqueda</a>
        </div>
      </section>
    `;
    return;
  }

  const cards = team.map((pokemon) => createTeamCard(pokemon)).join('');

  app.innerHTML = `
    <section class="section-card">
      <div class="section-header">
        <div>
          <p class="muted">Equipo</p>
          <h1>Mi equipo Pokémon</h1>
          <p>Armá tu mejor combinación de hasta 6 integrantes.</p>
        </div>

        <div class="info-panel">
          <h2>${count}/6</h2>
          <p class="muted">${count === 6 ? 'Equipo completo' : 'Lugares disponibles: ' + (6 - count)}</p>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <div>
          <p class="muted">Integrantes</p>
          <h2>Pokémon seleccionados</h2>
        </div>
        <a class="btn btn-secondary" href="#/search">Seguir explorando</a>
      </div>

      <div class="cards-grid">
        ${cards}
      </div>
    </section>
  `;

  bindRemoveButtons(app);
}