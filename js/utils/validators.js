export function validateWishlistForm(data) {
  const errors = {};

  const priority = Number(data.priority);

  if (!data.priority?.toString().trim()) {
    errors.priority = 'La prioridad es obligatoria.';
  } else if (!Number.isFinite(priority) || priority <= 0) {
    errors.priority = 'La prioridad debe ser un número mayor a 0.';
  }

  if (!data.tag?.trim()) {
    errors.tag = 'La etiqueta es obligatoria.';
  } else if (data.tag.trim().length < 2) {
    errors.tag = 'La etiqueta debe tener al menos 2 caracteres.';
  }

  if ((data.note || '').length > 150) {
    errors.note = 'La nota no puede superar los 150 caracteres.';
  }

  return errors;
}
