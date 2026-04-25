export function setupNavbar() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('#mainNav a');

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

export function markActiveNav() {
  const currentHash = window.location.hash || '#/';
  const navLinks = document.querySelectorAll('#mainNav a');

  navLinks.forEach((link) => {
    const linkHash = link.getAttribute('href');

    const isActive =
      currentHash === linkHash ||
      (linkHash !== '#/' && currentHash.startsWith(linkHash));

    link.classList.toggle('active', isActive);
  });
}