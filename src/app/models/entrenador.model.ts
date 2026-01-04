/*
 * Modelo de Entrenador.
 * Este modelo coincide con la estructura que guardo en la Mock API:
 * nombre, apellidos, edad, región, Pokémon favorito y un avatar.
 */

export class Entrenador {
  // En MockAPI el id suele ser un string, por eso lo tipamos así y además es opcional.
  id?: string;
  nombre!: string;
  apellidos!: string;
  edad!: number;
  region!: string;
  pokemonFavorito!: string;
  avatar!: string;

  /*
   * Igual que en otros modelos, uso Partial para poder crear entrenadores
   * tanto desde respuestas de API como desde formularios.
   */
  constructor(data?: Partial<Entrenador>) {
    Object.assign(this, data);
  }
}
