/*
 * Modelo para guardar información de un Pokémon que el usuario ha seleccionado.
 * En mi proyecto lo puedo usar para cosas como apodos o notas (por ejemplo, equipo o favoritos).
 */

export class Seleccionado {
  id?: string;
  pokemonId!: number;
  pokemonName!: string;
  nickname!: string;
  notes?: string;

  constructor(data?: Partial<Seleccionado>) {
    Object.assign(this, data);
  }
}
