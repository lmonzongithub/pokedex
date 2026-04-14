import { getInitialPokemonDataset } from '../api/pokemonApi.js';
import { store } from '../state/store.js';
import { chunkPage, capitalize } from '../utils/helpers.js';
import { createPokemonCard } from '../components/pokemonCard.js';
import { renderLoader } from '../components/loader.js';
import { renderPagination } from '../components/pagination.js';
import { renderInlineMessage } from '../components/modal.js';
import { renderEmptyState } from '../components/emptyState.js';

const TYPE_OPTIONS = [
  '', 'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function applyFilters(dataset, filters) {
  return dataset.filter((pokemon) => {
    const matchesName = !filters.name || pokemon.name.toLowerCase().includes(filters.name.toLowerCase().trim());
    const matchesType = !filters.type || pokemon.types.includes(filters.type);
    const matchesMin = !filters.minId || pokemon.id >= Number(filters.minId);
    const matchesMax = !filters.maxId || pokemon.id <= Number(filters.maxId);

    return matchesName && matchesType && matchesMin && matchesMax;
  });
}

function renderResultsSection() {
  const totalPages = Math.max(1, Math.ceil(store.currentSearchResults.length / store.pageSize));
  const currentItems = chunkPage(store.currentSearchResults, store.currentPage, store.pageSize);

  if (!store.currentSearchResults.length) {
    return renderEmptyState('Sin resultados', 'No se encontraron Pokémon con esos filtros.');
  }

  const cards = currentItems.map((pokemon) => createPokemonCard(pokemon)).join('');

  return `
    <section class="section-card">
      <div class="section-header">
        <div>
          <p class="muted">Resultados</p>
          <h2>${store.currentSearchResults.length} Pokémon encontrados</h2>
        </div>
      </div>
      <div class="cards-grid">${cards}</div>
      ${renderPagination(store.currentPage, totalPages)}
    </section>
  `;
}

function renderSearchLayout() {
  const typeOptionsHtml = TYPE_OPTIONS.map((type) => `<option value="${type}" ${store.filters.type === type ? 'selected' : ''}>${type ? capitalize(type) : 'Todos'}</option>`).join('');

  return `
    <section class="filters-panel">
      <div class="section-header">
        <div>
          <p class="muted">Búsqueda con filtros</p>
          <h1>Buscador de Pokémon</h1>
        </div>
      </div>
      <form id="searchForm" class="form-grid form-grid--filters">
        <div class="field">
          <label for="name">Nombre</label>
          <input id="name" name="name" placeholder="Ej: pika" value="${store.filters.name}" />
        </div>
        <div class="field">
          <label for="type">Tipo</label>
          <select id="type" name="type">${typeOptionsHtml}</select>
        </div>
        <div class="field">
          <label for="minId">ID mínimo</label>
          <input id="minId" name="minId" type="number" min="1" placeholder="1" value="${store.filters.minId}" />
        </div>
        <div class="field">
          <label for="maxId">ID máximo</label>
          <input id="maxId" name="maxId" type="number" min="1" placeholder="151" value="${store.filters.maxId}" />
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" type="submit">Buscar</button>
          <button class="btn btn-secondary" type="button" id="clearFilters">Limpiar</button>
        </div>
      </form>
    </section>

    ${renderResultsSection()}
  `;
}

function bindSearchEvents(app) {
  const form = app.querySelector('#searchForm');
  const clearButton = app.querySelector('#clearFilters');
  const pagination = app.querySelector('.pagination');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    store.filters = {
      name: String(formData.get('name') || ''),
      type: String(formData.get('type') || ''),
      minId: String(formData.get('minId') || ''),
      maxId: String(formData.get('maxId') || '')
    };
    store.currentPage = 1;
    store.currentSearchResults = applyFilters(store.searchResults, store.filters);
    app.innerHTML = renderSearchLayout();
    bindSearchEvents(app);
  });

  clearButton?.addEventListener('click', () => {
    store.filters = { name: '', type: '', minId: '', maxId: '' };
    store.currentPage = 1;
    store.currentSearchResults = [...store.searchResults];
    app.innerHTML = renderSearchLayout();
    bindSearchEvents(app);
  });

  pagination?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page-action]');
    if (!button) return;

    const totalPages = Math.max(1, Math.ceil(store.currentSearchResults.length / store.pageSize));
    const action = button.dataset.pageAction;

    if (action === 'prev' && store.currentPage > 1) store.currentPage -= 1;
    if (action === 'next' && store.currentPage < totalPages) store.currentPage += 1;

    app.innerHTML = renderSearchLayout();
    bindSearchEvents(app);
  });
}

export async function renderSearchView(app) {
  if (!store.searchResults.length) {
    app.innerHTML = renderLoader('Cargando dataset inicial...');
    try {
      store.searchResults = await getInitialPokemonDataset(151);
      store.currentSearchResults = [...store.searchResults];
    } catch (error) {
      app.innerHTML = renderInlineMessage('No pudimos obtener los datos desde la API.', 'error');
      return;
    }
  }

  if (!store.currentSearchResults.length) {
    store.currentSearchResults = [...store.searchResults];
  }

  app.innerHTML = renderSearchLayout();
  bindSearchEvents(app);
}
