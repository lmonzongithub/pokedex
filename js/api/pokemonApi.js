import { formatPokemon } from '../utils/helpers.js';

const API_BASE = 'https://pokeapi.co/api/v2';
const CACHE_LIMIT = 151;

async function request(url) {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('network');
  }

  if (!response.ok) {
    throw new Error(`http_${response.status}`);
  }

  return response.json();
}

export async function getPokemonByIdOrName(idOrName) {
  const data = await request(`${API_BASE}/pokemon/${idOrName}`);
  return formatPokemon(data);
}

export async function getPokemonList(limit = 10, offset = 0) {
  return request(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
}

export async function getPokemonByType(typeName) {
  const data = await request(`${API_BASE}/type/${typeName}`);
  return data.pokemon.map((entry) => entry.pokemon);
}

export async function getInitialPokemonDataset(limit = CACHE_LIMIT) {
  const baseList = await getPokemonList(limit, 0);
  const detailRequests = baseList.results.map((item) => request(item.url));
  const fullList = await Promise.all(detailRequests);
  return fullList.map(formatPokemon);
}
