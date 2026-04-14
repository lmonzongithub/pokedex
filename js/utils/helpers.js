export function capitalize(text = '') {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPokemon(pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      '',
    types: pokemon.types?.map((item) => item.type.name) || [],
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities?.map((item) => item.ability.name) || [],
    stats: pokemon.stats?.map((item) => ({
      name: item.stat.name,
      value: item.base_stat
    })) || []
  };
}

export function chunkPage(items, currentPage, pageSize) {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function formatDate(dateIso) {
  const date = new Date(dateIso);
  return date.toLocaleString('es-AR');
}
