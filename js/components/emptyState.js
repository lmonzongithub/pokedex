export function renderEmptyState(title, message) {
  return `
    <div class="empty-state">
      <h2>${title}</h2>
      <p>${message}</p>
    </div>
  `;
}
