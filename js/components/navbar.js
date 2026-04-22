export function setupNavbar() {
  const navbar = document.getElementById('navbar');

  if (!navbar) return;

  navbar.innerHTML = `
    <nav class="main-nav" aria-label="Navegación principal">
      <a class="nav-link" href="#/">Home</a>
      <a class="nav-link" href="#/search">Búsqueda</a>
      <a class="nav-link" href="#/wishlist">Mi equipo</a>
      <a class="nav-link" href="#/history">Historial</a>
      <a class="nav-link" href="#/contact">Contacto</a>
    </nav>
  `;
}

export function markActiveNav() {
  const currentHash = window.location.hash || '#/';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const linkHash = link.getAttribute('href');

    const isActive =
      currentHash === linkHash ||
      (linkHash !== '#/' && currentHash.startsWith(linkHash));

    link.classList.toggle('active', isActive);
  });
}