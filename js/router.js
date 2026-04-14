import { renderHomeView } from './views/homeView.js';
import { renderSearchView } from './views/searchView.js';
import { renderContactView } from './views/contactView.js';
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
