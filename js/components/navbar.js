export function setupNavbar() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

export function markActiveNav() {
  const path = window.location.hash || '#/';
  const links = document.querySelectorAll('#mainNav a');

  links.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === path || (path.startsWith('#/detail') && link.getAttribute('href') === '#/search'));
  });
}
