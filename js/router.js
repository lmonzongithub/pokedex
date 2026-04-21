import { renderHomeView } from './views/homeView.js';
import { renderSearchView } from './views/searchView.js';
import { renderContactView } from './views/contactView.js';
import { renderWishlistView } from './views/wishlistView.js';
import { renderDetailView } from './views/detailView.js';
import { renderHistoryView } from './views/historyView.js';
import { markActiveNav } from './components/navbar.js';

export async function router() {
  const app = document.getElementById('app');
  const hash = window.location.hash || '#/';
  const cleanHash = hash.replace(/^#/, '');
  const segments = cleanHash.split('/').filter(Boolean);

  markActiveNav();

  switch (segments[0]) {
    case undefined:
      await renderHomeView(app);
      break;

    case 'search':
      await renderSearchView(app);
      break;

    case 'detail':
      if (segments[1]) {
        await renderDetailView(app, segments[1]);
      } else {
        app.innerHTML = `
          <section class="section-card">
            <h1>Detalle no disponible</h1>
            <p>No se indicó un Pokémon válido.</p>
            <a class="btn btn-primary" href="#/search">Ir a búsqueda</a>
          </section>
        `;
      }
      break;

    case 'history':
      renderHistoryView(app);
      break;
    case 'wishlist':
      renderWishlistView(app);
      break;
    case 'contact':
      renderContactView(app);
      break;

    default:
      app.innerHTML = `
        <section class="section-card">
          <h1>404</h1>
          <p>No encontramos la ruta solicitada.</p>
          <a class="btn btn-primary" href="#/">Volver al inicio</a>
        </section>
      `;
  }

  document.getElementById('app')?.focus();
}