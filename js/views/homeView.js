import { createPokemonCard } from '../components/pokemonCard.js';
import { renderLoader } from '../components/loader.js';
import { renderEmptyState } from '../components/emptyState.js';
import { getInitialPokemonDataset } from '../api/pokemonApi.js';

export async function renderHomeView(app) {
  app.innerHTML = renderLoader('Cargando portada...');

  try {
    const pokemons = await getInitialPokemonDataset(6);
    const cards = pokemons.map((pokemon) => createPokemonCard(pokemon)).join('');

    app.innerHTML = `
      <section class="hero">
        <div>
          <p class="muted">Aplicación Web Móvil · Pokédex</p>
          <h1>Explorá los Pokémones, guardá tus favoritos y chequea tu historial.</h1>
          <p>PokéExplorer es una aplicación pensada para dispositivos móviles que permite buscar Pokémones, ver su detalle y agregar tus favoritos a la lista de deseos!</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/search">Ir a búsqueda</a>
            <a class="btn btn-secondary" href="#/wishlist">Ver lista de deseos</a>
          </div>
        </div>
      </section>

      <section class="section-card">
        <div class="section-header">
          <div>
            <p class="muted">Home</p>
            <h2>Pokémon destacados</h2>
          </div>
        </div>
        <div class="cards-grid">${cards}</div>
      </section>
    `;
  } catch {
    app.innerHTML = renderEmptyState('No pudimos cargar la home', 'Verificá tu conexión e intentá nuevamente.');
  }
}
