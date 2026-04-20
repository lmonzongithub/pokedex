import { capitalize } from '../utils/helpers.js';
import { formatPokemonNumber } from '../utils/formatters.js';

export function createPokemonCard(pokemon, options = {}) {
  const { extra = '', actionLabel = 'Ver detalle', actionHref = `#/detail/${pokemon.id}` } = options;
const types = (pokemon.types || []).map((type) => `<span class="badge">${capitalize(type)}</span>`).join('');
  return `
    <article class="pokemon-card">
      <img src="${pokemon.image}" alt="${capitalize(pokemon.name)}" />
      <div class="pokemon-card__header">
        <div>
          <p class="muted">${formatPokemonNumber(pokemon.id)}</p>
          <h3>${capitalize(pokemon.name)}</h3>
        </div>
      </div>
      <div class="badges">${types}</div>
      ${extra}
      <div class="pokemon-card__actions">
        <a class="btn btn-primary" href="${actionHref}">${actionLabel}</a>
      </div>
    </article>
  `;
}
