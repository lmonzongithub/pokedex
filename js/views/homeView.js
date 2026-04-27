import { createPokemonCard } from '../components/pokemonCard.js';
import { renderLoader } from '../components/loader.js';
import { renderEmptyState } from '../components/emptyState.js';
import { getInitialPokemonDataset } from '../api/pokemonApi.js';

let heroRotationInterval = null;

const TYPE_THEME = {
  grass: {
    accent: '#7ac74c',
    soft: 'rgba(122, 199, 76, 0.20)',
    secondary: 'rgba(91, 160, 58, 0.10)'
  },
  fire: {
    accent: '#ee8130',
    soft: 'rgba(238, 129, 48, 0.20)',
    secondary: 'rgba(255, 186, 107, 0.10)'
  },
  water: {
    accent: '#6390f0',
    soft: 'rgba(99, 144, 240, 0.20)',
    secondary: 'rgba(85, 125, 220, 0.10)'
  },
  electric: {
    accent: '#f7d02c',
    soft: 'rgba(247, 208, 44, 0.22)',
    secondary: 'rgba(255, 221, 87, 0.12)'
  },
  psychic: {
    accent: '#f95587',
    soft: 'rgba(249, 85, 135, 0.18)',
    secondary: 'rgba(255, 153, 185, 0.10)'
  },
  ice: {
    accent: '#96d9d6',
    soft: 'rgba(150, 217, 214, 0.22)',
    secondary: 'rgba(200, 242, 239, 0.10)'
  },
  dragon: {
    accent: '#6f35fc',
    soft: 'rgba(111, 53, 252, 0.18)',
    secondary: 'rgba(164, 132, 255, 0.10)'
  },
  dark: {
    accent: '#705746',
    soft: 'rgba(112, 87, 70, 0.18)',
    secondary: 'rgba(155, 129, 112, 0.10)'
  },
  fairy: {
    accent: '#d685ad',
    soft: 'rgba(214, 133, 173, 0.20)',
    secondary: 'rgba(240, 188, 214, 0.10)'
  },
  fighting: {
    accent: '#c22e28',
    soft: 'rgba(194, 46, 40, 0.18)',
    secondary: 'rgba(225, 111, 106, 0.10)'
  },
  poison: {
    accent: '#a33ea1',
    soft: 'rgba(163, 62, 161, 0.18)',
    secondary: 'rgba(201, 125, 198, 0.10)'
  },
  ground: {
    accent: '#e2bf65',
    soft: 'rgba(226, 191, 101, 0.22)',
    secondary: 'rgba(240, 217, 154, 0.10)'
  },
  flying: {
    accent: '#a98ff3',
    soft: 'rgba(169, 143, 243, 0.20)',
    secondary: 'rgba(206, 194, 249, 0.10)'
  },
  bug: {
    accent: '#a6b91a',
    soft: 'rgba(166, 185, 26, 0.20)',
    secondary: 'rgba(202, 218, 90, 0.10)'
  },
  rock: {
    accent: '#b6a136',
    soft: 'rgba(182, 161, 54, 0.20)',
    secondary: 'rgba(215, 199, 117, 0.10)'
  },
  ghost: {
    accent: '#735797',
    soft: 'rgba(115, 87, 151, 0.18)',
    secondary: 'rgba(164, 143, 194, 0.10)'
  },
  steel: {
    accent: '#b7b7ce',
    soft: 'rgba(183, 183, 206, 0.22)',
    secondary: 'rgba(222, 222, 235, 0.10)'
  },
  normal: {
    accent: '#a8a77a',
    soft: 'rgba(168, 167, 122, 0.20)',
    secondary: 'rgba(210, 209, 174, 0.10)'
  }
};

function applyHeroTheme(heroElement, pokemon) {
  const mainType = pokemon.types?.[0] || 'normal';
  const theme = TYPE_THEME[mainType] || TYPE_THEME.normal;

  heroElement.style.setProperty('--hero-accent', theme.accent);
  heroElement.style.setProperty('--hero-accent-soft', theme.soft);
  heroElement.style.setProperty('--hero-accent-secondary', theme.secondary);
}

function applyHeroPokemon(heroElement, heroImage, heroName, pokemon) {
  if (!heroElement || !heroImage || !pokemon) return;

  heroImage.src = pokemon.image;
  heroImage.alt = pokemon.name;
  heroImage.setAttribute('data-type', pokemon.types?.[0] || 'normal');

  if (heroName) {
    heroName.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  }

  applyHeroTheme(heroElement, pokemon);
}

function getRandomItems(items, count) {
  const shuffled = [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);

  return shuffled.slice(0, count);
}

function startHeroRotation(pokemons) {
  const heroElement = document.querySelector('.hero');
  const heroImage = document.getElementById('heroPokemon');
  const heroName = document.getElementById('heroPokemonName');

  if (!heroElement || !heroImage || !pokemons.length) return;

  if (heroRotationInterval) {
    clearInterval(heroRotationInterval);
  }

  let currentIndex = Math.floor(Math.random() * pokemons.length);

  applyHeroPokemon(heroElement, heroImage, heroName, pokemons[currentIndex]);

  heroRotationInterval = setInterval(() => {
    const currentHero = document.querySelector('.hero');
    const currentImage = document.getElementById('heroPokemon');
    const currentName = document.getElementById('heroPokemonName');

    if (!currentHero || !currentImage) {
      clearInterval(heroRotationInterval);
      heroRotationInterval = null;
      return;
    }

    currentIndex = Math.floor(Math.random() * pokemons.length);
    applyHeroPokemon(currentHero, currentImage, currentName, pokemons[currentIndex]);
  }, 4000);
}

export async function renderHomeView(app) {
  app.innerHTML = renderLoader('Cargando portada...');

  try {
    // Traemos una sola vez el dataset inicial
    const allPokemons = await getInitialPokemonDataset(151);

    // Elegimos 4 destacados aleatorios para esta carga
    const featuredPokemons = getRandomItems(allPokemons, 4);

    const cards = featuredPokemons
      .map((pokemon) => createPokemonCard(pokemon))
      .join('');

    app.innerHTML = `
      <section class="hero">
        <div class="hero__content">

          <h1>
            Explorá Pokémon,
            armá tu equipo ideal
            y dominá la liga.
          </h1>

          <p>
            Buscá tus Pokémon favoritos, analizá sus stats y construí el mejor equipo posible.
          </p>

          <div class="hero-actions">
            <a class="btn btn-primary" href="#/search">Ir a búsqueda</a>
            <a class="btn btn-secondary" href="#/wishlist">Ver mi equipo</a>
          </div>
        </div>

        <div class="hero__visual">
          <img id="heroPokemon" alt="Pokémon destacado" />
          <span class="hero__caption">
            Destacado:
            <strong id="heroPokemonName"></strong>
          </span>
        </div>
      </section>

      <section class="section-card featured-section">
        <div class="section-header featured-section__header">
          <div>
            <p class="muted">Destacados</p>
            <h2>Pokémones para empezar tu recorrido</h2>
            <p>
              Una selección aleatoria para explorar la app y descubrir posibles integrantes para tu equipo.
            </p>
          </div>

          <a class="btn btn-secondary" href="#/search">Explorar catálogo completo</a>
        </div>

        <div class="cards-grid">
          ${cards}
        </div>
      </section>
    `;

    // El hero rota sobre todo el dataset inicial (151)
    startHeroRotation(allPokemons);
  } catch {
    app.innerHTML = renderEmptyState(
      'No pudimos cargar la home.',
      'Verificá tu conexión e intentá nuevamente.'
    );
  }
}