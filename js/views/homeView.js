import { createPokemonCard } from '../components/pokemonCard.js';
import { renderLoader } from '../components/loader.js';
import { renderEmptyState } from '../components/emptyState.js';
import { getInitialPokemonDataset } from '../api/pokemonApi.js';

export async function renderHomeView(app) {
  // Primero mostramos un loader para que el usuario vea que la home está cargando
  app.innerHTML = renderLoader('Cargando portada...');

  try {
    // Traemos algunos Pokémon para mostrarlos como destacados en la home
    const pokemons = await getInitialPokemonDataset(6);

    // Transformamos cada Pokémon en una card HTML
    const cards = pokemons.map((pokemon) => createPokemonCard(pokemon)).join('');

    // Reemplazamos el contenido del contenedor principal por la vista Home
    app.innerHTML = `
      <section class="hero">
        <div>
          <p class="muted">Aplicación Web Móvil · Pokédex</p>
          <h1>Armá tu equipo Pokémon ideal y explorá tus favoritos.</h1>
          <p>
            PokéExplorer es una aplicación web móvil pensada para buscar Pokémon,
            ver su detalle, revisar el historial de visitas y construir un equipo
            de hasta 6 integrantes.
          </p>

          <div class="hero-actions">
            <a class="btn btn-primary" href="#/search">Explorar Pokémon</a>
            <a class="btn btn-secondary" href="#/wishlist">Ver mi equipo</a>
          </div>
        </div>
      </section>

      <section class="section-card">
        <div class="section-header">
          <div>
            <p class="muted">¿Qué podés hacer?</p>
            <h2>Funciones principales</h2>
          </div>
        </div>

        <div class="cards-grid">
          <article class="section-card">
            <h3>Buscar Pokémon</h3>
            <p>Usá filtros por nombre, tipo o rango para encontrar rápidamente los Pokémon que te interesan.</p>
          </article>

          <article class="section-card">
            <h3>Ver detalles completos</h3>
            <p>Consultá información general, tipos, habilidades y estadísticas principales de cada Pokémon.</p>
          </article>

          <article class="section-card">
            <h3>Armar tu equipo</h3>
            <p>Elegí hasta 6 Pokémon y construí tu propio equipo ideal sin duplicados.</p>
          </article>
        </div>
      </section>

      <section class="section-card">
        <div class="section-header">
          <div>
            <p class="muted">Destacados</p>
            <h2>Pokémon para empezar a explorar</h2>
            <p>Una selección inicial para que empieces a recorrer la app desde la portada.</p>
          </div>
        </div>

        <div class="cards-grid">
          ${cards}
        </div>
      </section>
    `;
  } catch {
    // Si falla la API, mostramos un estado vacío con mensaje claro
    app.innerHTML = renderEmptyState(
      'No pudimos cargar la home.',
      'Verificá tu conexión e intentá nuevamente.'
    );
  }
}