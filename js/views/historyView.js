import { store } from '../state/store.js';
import { saveHistory } from '../storage/localStorageService.js';
import { renderEmptyState } from '../components/emptyState.js';
import { createPokemonCard } from '../components/pokemonCard.js';
import { formatDate } from '../utils/helpers.js';

export function renderHistoryView(app) {
  if (!store.history.length) {
    app.innerHTML = `
      <section class="section-card">
        <div class="section-header">
          <div>
            <p class="muted">Más reciente primero</p>
            <h1>Historial de ítems visitados</h1>
          </div>
        </div>

        ${renderEmptyState(
          'Todavía no visitaste ningún Pokémon',
          'Entrá a un detalle para empezar a registrar el historial.'
        )}
      </section>
    `;
    return;
  }

  const cards = store.history
    .map((item) =>
      createPokemonCard(item, {
        extra: `<p class="muted">Visitado: ${formatDate(item.visitedAt)}</p>`
      })
    )
    .join('');

  app.innerHTML = `
    <section class="section-card">
      <div class="section-header">
        <div>
          <p class="muted">Más reciente primero</p>
          <h1>Historial de ítems visitados</h1>
        </div>

        <button id="clearHistoryBtn" class="btn btn-secondary" type="button">
          Limpiar historial
        </button>
      </div>

      <div class="cards-grid">${cards}</div>
    </section>
  `;

  const clearButton = app.querySelector('#clearHistoryBtn');

  clearButton?.addEventListener('click', () => {
    store.history = [];
    saveHistory(store.history);
    renderHistoryView(app);
  });
}