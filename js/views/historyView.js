import { store } from '../state/store.js';
import { renderEmptyState } from '../components/emptyState.js';
import { createPokemonCard } from '../components/pokemonCard.js';
import { formatDate } from '../utils/helpers.js';

export function renderHistoryView(app) {
  if (!store.history.length) {
    app.innerHTML = renderEmptyState('Todavía no visitaste ningún Pokémon', 'Entrá a un detalle para empezar a registrar el historial.');
    return;
  }

  const cards = store.history.map((item) => createPokemonCard(item, {
    extra: `<p class="muted">Visitado: ${formatDate(item.visitedAt)}</p>`
  })).join('');

  app.innerHTML = `
    <section class="section-card">
      <div class="section-header">
        <div>
          <p class="muted">Más reciente primero</p>
          <h1>Historial de ítems visitados</h1>
        </div>
      </div>
      <div class="cards-grid">${cards}</div>
    </section>
  `;
}
