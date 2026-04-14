export function renderContactView(app) {
  app.innerHTML = `
    <section class="contact-panel">
      <div class="section-header">
        <div>
          <p class="muted">Contacto</p>
          <h1>Estudio PokéExplorer</h1>
        </div>
      </div>

      <div class="grid-page">
        <div class="info-panel">
          <h2>Datos del desarrollador</h2>
          <p><strong>Integrantes:</strong> Completar con ambos nombres</p>
          <p><strong>Ciudad:</strong> La Plata</p>
          <p><strong>Email:</strong> completar@email.com</p>
          <p><strong>Materia:</strong> Aplicaciones Móviles</p>
          <p class="muted">Ubicación solicitada por la consigna: Catedral de La Plata.</p>
        </div>

        <div>
          <iframe
            class="contact-map"
            title="Mapa de la Catedral de La Plata"
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-57.9586%2C-34.9245%2C-57.9486%2C-34.9185&layer=mapnik&marker=-34.9215%2C-57.9536">
          </iframe>
        </div>
      </div>
    </section>
  `;
}
