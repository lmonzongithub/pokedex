export function renderPagination(currentPage, totalPages) {
  if (totalPages <= 1) return '';

  return `
    <div class="pagination">
      <button class="btn btn-secondary" data-page-action="prev" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
      <span>Página ${currentPage} de ${totalPages}</span>
      <button class="btn btn-secondary" data-page-action="next" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
    </div>
  `;
}
