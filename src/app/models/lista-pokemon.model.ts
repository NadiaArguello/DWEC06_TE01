/*
 * Modelo para el listado de Pokémon.
 * Aquí solo guardo lo necesario para mostrar la lista: id, nombre y sprite.
 * El detalle completo lo cargo aparte cuando el usuario selecciona un Pokémon.
 */

export class ListaPokemon {
  id!: number;
  name!: string;
  sprite!: string;

  constructor(data?: Partial<ListaPokemon>) {
    Object.assign(this, data);
  }
}
