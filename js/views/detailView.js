import { getPokemonByIdOrName } from '../api/pokemonApi.js';
import { capitalize } from '../utils/helpers.js';
import { formatPokemonNumber } from '../utils/formatters.js';
import { renderLoader } from '../components/loader.js';
import { renderInlineMessage } from '../components/modal.js';
import { store } from '../state/store.js';
import { saveHistory, saveWishlist } from '../storage/localStorageService.js';

function addToHistory(pokemon) {
  const filtered = store.history.filter((item) => item.id !== pokemon.id);

  store.history = [
    {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      visitedAt: new Date().toISOString()
    },
    ...filtered
  ].slice(0, 30);

  saveHistory(store.history);
}

function renderDetail(pokemon, message = '', messageType = '') {
  const types = pokemon.types
    .map((type) => `<span class="badge">${capitalize(type)}</span>`)
    .join('');

  const abilities = pokemon.abilities
    .map((ability) => `<span class="badge">${capitalize(ability)}</span>`)
    .join('');

  const stats = pokemon.stats
    .map(
      (stat) => `
        <div class="stat-row">
          <span>${capitalize(stat.name)}</span>
          <strong>${stat.value}</strong>
        </div>
      `
    )
    .join('');

  const teamCount = store.wishlist.length;
  const isAlreadyInTeam = store.wishlist.some((item) => item.id === pokemon.id);
  const isTeamFull = teamCount >= 6;

  let actionButton = `
    <button id="addToTeamBtn" class="btn btn-primary" type="button">
      Agregar al equipo
    </button>
  `;

  if (isAlreadyInTeam) {
    actionButton = `
      <button class="btn btn-secondary" type="button" disabled>
        Ya está en tu equipo
      </button>
    `;
  } else if (isTeamFull) {
    actionButton = `
      <button class="btn btn-secondary" type="button" disabled>
        Equipo completo
      </button>
    `;
  }

  return `
    <section class="detail-panel">
      <div class="section-header">
        <div>
          <p class="muted">Detalle</p>
          <h1>${capitalize(pokemon.name)} <span class="muted">${formatPokemonNumber(pokemon.id)}</span></h1>
        </div>
        <a href="#/search" class="btn btn-secondary">Volver a resultados</a>
      </div>

      <div class="detail-layout">
        <div class="detail-image">
          <img src="${pokemon.image}" alt="${capitalize(pokemon.name)}" />
        </div>

        <div class="info-panel">
          <h2>Información general</h2>
          <div class="meta-list">
            <div class="meta-row"><span>Tipos</span><strong>${types}</strong></div>
            <div class="meta-row"><span>Altura</span><strong>${pokemon.height}</strong></div>
            <div class="meta-row"><span>Peso</span><strong>${pokemon.weight}</strong></div>
            <div class="meta-row"><span>Habilidades</span><strong>${abilities}</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid-page">
      <section class="section-card">
        <h2>Stats principales</h2>
        <div class="stats-list">${stats}</div>
      </section>

      <section class="form-panel">
        <h2>Mi equipo Pokémon</h2>
        <p class="muted">Podés armar un equipo de hasta 6 Pokémon.</p>
        <p><strong>${teamCount}/6</strong> integrantes</p>
        ${message ? renderInlineMessage(message, messageType) : ''}
        <div class="hero-actions">
          ${actionButton}
          <a href="#/wishlist" class="btn btn-secondary">Ver mi equipo</a>
        </div>
      </section>
    </section>
  `;
}

function bindTeamButton(app, pokemon) {
  const button = app.querySelector('#addToTeamBtn');
  if (!button) return;

  button.addEventListener('click', () => {
    const isAlreadyInTeam = store.wishlist.some((item) => item.id === pokemon.id);

    if (isAlreadyInTeam) {
      app.innerHTML = renderDetail(
        pokemon,
        'Este Pokémon ya forma parte de tu equipo.',
        'error'
      );
      bindTeamButton(app, pokemon);
      return;
    }

    if (store.wishlist.length >= 6) {
      app.innerHTML = renderDetail(
        pokemon,
        'Tu equipo ya está completo. Eliminá uno para agregar otro.',
        'error'
      );
      bindTeamButton(app, pokemon);
      return;
    }

    store.wishlist = [
      ...store.wishlist,
      {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        addedAt: new Date().toISOString()
      }
    ];

    saveWishlist(store.wishlist);

    window.location.hash = '#/wishlist';
  });
}

export async function renderDetailView(app, id) {
  app.innerHTML = renderLoader('Cargando detalle...');

  try {
    const pokemon = await getPokemonByIdOrName(id);

    addToHistory(pokemon);

    app.innerHTML = renderDetail(pokemon);
    bindTeamButton(app, pokemon);
  } catch {
    app.innerHTML = renderInlineMessage(
      'No pudimos cargar el detalle del Pokémon solicitado.',
      'error'
    );
  }
}