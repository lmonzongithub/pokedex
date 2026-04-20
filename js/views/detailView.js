import { getPokemonByIdOrName } from '../api/pokemonApi.js';
import { capitalize } from '../utils/helpers.js';
import { formatPokemonNumber } from '../utils/formatters.js';
import { renderLoader } from '../components/loader.js';
import { renderInlineMessage } from '../components/modal.js';
import { store } from '../state/store.js';
import { saveHistory, saveWishlist } from '../storage/localStorageService.js';
import { validateWishlistForm } from '../utils/validators.js';

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

function renderDetail(pokemon, errors = {}, successMessage = '') {
  const types = pokemon.types.map((type) => `<span class="badge">${capitalize(type)}</span>`).join('');
  const abilities = pokemon.abilities.map((ability) => `<span class="badge">${capitalize(ability)}</span>`).join('');
  const stats = pokemon.stats.map((stat) => `
    <div class="stat-row">
      <span>${capitalize(stat.name)}</span>
      <strong>${stat.value}</strong>
    </div>
  `).join('');

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
        <h2>Agregar a lista de deseos</h2>
        ${successMessage ? renderInlineMessage(successMessage, 'success') : ''}
        <form id="wishlistForm" class="form-grid">
          <div class="field">
            <label for="priority">Prioridad</label>
            <input id="priority" name="priority" type="number" min="1" />
            ${errors.priority ? `<span class="error-text">${errors.priority}</span>` : ''}
          </div>
          <div class="field">
            <label for="tag">Etiqueta</label>
            <input id="tag" name="tag" type="text" placeholder="Ej: favorito" />
            ${errors.tag ? `<span class="error-text">${errors.tag}</span>` : ''}
          </div>
          <div class="field">
            <label for="note">Nota personal</label>
            <textarea id="note" name="note" maxlength="150" placeholder="Observaciones opcionales"></textarea>
            ${errors.note ? `<span class="error-text">${errors.note}</span>` : ''}
          </div>
          <button class="btn btn-primary" type="submit">Guardar en lista</button>
        </form>
      </section>
    </section>
  `;
}

function bindWishlistForm(app, pokemon) {
  const form = app.querySelector('#wishlistForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      priority: String(formData.get('priority') || ''),
      tag: String(formData.get('tag') || ''),
      note: String(formData.get('note') || '')
    };

    const errors = validateWishlistForm(payload);
    if (Object.keys(errors).length) {
      app.innerHTML = renderDetail(pokemon, errors);
      bindWishlistForm(app, pokemon);
      return;
    }

    const filtered = store.wishlist.filter((item) => item.id !== pokemon.id);
    store.wishlist = [
      {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        priority: Number(payload.priority),
        tag: payload.tag.trim(),
        note: payload.note.trim(),
        addedAt: new Date().toISOString()
      },
      ...filtered
    ];

    saveWishlist(store.wishlist);
    app.innerHTML = renderDetail(pokemon, {}, 'Pokémon agregado correctamente a la lista de deseos.');
    bindWishlistForm(app, pokemon);
  });
}

export async function renderDetailView(app, id) {
  app.innerHTML = renderLoader('Cargando detalle...');

  try {
    const pokemon = await getPokemonByIdOrName(id);
    addToHistory(pokemon);
    app.innerHTML = renderDetail(pokemon);
    bindWishlistForm(app, pokemon);
  } catch {
    app.innerHTML = renderInlineMessage('No pudimos cargar el detalle del Pokémon solicitado.', 'error');
  }
}
