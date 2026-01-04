/*
 * Diccionarios de traducción al castellano.
 * PokéAPI devuelve nombres en inglés (por ejemplo "fire" o "special-attack"),
 * así que en la interfaz uso estos diccionarios para mostrar etiquetas en español.
 */

// Tipos (coinciden con PokéAPI)
export const TIPOS_ES: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

// Estadísticas base
export const STATS_ES: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad',
};

// Generaciones
export const GENERACIONES_ES: Record<string, string> = {
  'generation-i': 'Generación I',
  'generation-ii': 'Generación II',
  'generation-iii': 'Generación III',
  'generation-iv': 'Generación IV',
  'generation-v': 'Generación V',
  'generation-vi': 'Generación VI',
  'generation-vii': 'Generación VII',
  'generation-viii': 'Generación VIII',
  'generation-ix': 'Generación IX',
};

