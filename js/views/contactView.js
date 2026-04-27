function validateContactForm(values) {
  const errors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = 'El nombre es obligatorio.';
  } else if (name.length < 3) {
    errors.name = 'Debe tener al menos 3 caracteres.';
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    errors.name = 'Solo letras y espacios.';
  }

  if (!email) {
    errors.email = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Formato inválido.';
  }

  if (!message) {
    errors.message = 'El mensaje es obligatorio.';
  } else if (message.length < 10) {
    errors.message = 'Mínimo 10 caracteres.';
  } else if (message.length > 250) {
    errors.message = 'Máximo 250 caracteres.';
  }

  return errors;
}

export function renderContactView(app) {
  app.innerHTML = `
    <section class="grid-page">

      <section class="contact-panel">
        <div class="section-header">
          <div>
            <p class="muted">Contacto</p>
            <h1>Contactá al equipo</h1>
            <p>Completá el formulario.</p>
          </div>
        </div>

        <form id="contactForm" class="form-grid" novalidate>

          <div class="field">
            <label>Nombre</label>
            <input id="name" type="text" />
            <span class="error-text" id="error-name"></span>
          </div>

          <div class="field">
            <label>Email</label>
            <input id="email" type="text" />
            <span class="error-text" id="error-email"></span>
          </div>

          <div class="field">
            <div class="field-header">
              <label>Mensaje</label>
              <span id="counter" class="char-counter">0/250</span>
            </div>

            <textarea id="message" maxlength="250"></textarea>
            <span class="error-text" id="error-message"></span>
          </div>

          <button id="submitBtn" class="btn btn-primary" disabled>
            Enviar
          </button>

          <div id="successMsg" class="message message-success" style="display:none;"></div>

        </form>
      </section>

      <section class="contact-panel">
        <div class="section-header">
          <div>
            <p class="muted">Ubicación</p>
            <h2>Nuestra oficina</h2>
            <p>Estamos ubicados en la Catedral de La Plata.</p>
          </div>
        </div>

        <iframe
          class="contact-map"
          title="Mapa Catedral de La Plata"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-57.9585%2C-34.9250%2C-57.9490%2C-34.9180&layer=mapnik&marker=-34.9215%2C-57.9536">
        </iframe>
      </section>

    </section>
  `;

  bindEvents(app);
}

function bindEvents(app) {
  const name = app.querySelector('#name');
  const email = app.querySelector('#email');
  const message = app.querySelector('#message');
  const counter = app.querySelector('#counter');
  const btn = app.querySelector('#submitBtn');
  const success = app.querySelector('#successMsg');

  const errorName = app.querySelector('#error-name');
  const errorEmail = app.querySelector('#error-email');
  const errorMessage = app.querySelector('#error-message');

  function getValues() {
    return {
      name: name.value,
      email: email.value,
      message: message.value
    };
  }

  function showErrors(errors) {
    errorName.textContent = errors.name || '';
    errorEmail.textContent = errors.email || '';
    errorMessage.textContent = errors.message || '';

    name.classList.toggle('input-error', !!errors.name);
    email.classList.toggle('input-error', !!errors.email);
    message.classList.toggle('input-error', !!errors.message);
  }

  function update() {
    const values = getValues();
    const errors = validateContactForm(values);

    showErrors(errors);

    btn.disabled = Object.keys(errors).length !== 0;
  }

  // eventos en vivo
  [name, email, message].forEach((input) => {
    input.addEventListener('input', update);
  });

  // contador
  message.addEventListener('input', () => {
    counter.textContent = `${message.value.length}/250`;
  });

  // submit
  app.querySelector('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const values = getValues();
    const errors = validateContactForm(values);

    if (Object.keys(errors).length) {
      showErrors(errors);
      return;
    }

    success.style.display = 'block';
    success.textContent = 'Consulta enviada correctamente.';

    // reset
    name.value = '';
    email.value = '';
    message.value = '';
    counter.textContent = '0/250';
    btn.disabled = true;

    showErrors({});
  });

  update(); // estado inicial
}