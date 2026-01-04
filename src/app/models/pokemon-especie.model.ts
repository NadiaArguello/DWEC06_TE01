/*
 * Modelo para la información de especie.
 * Lo uso sobre todo para acceder a la generación del Pokémon,
 * que en PokéAPI viene en el endpoint /pokemon-species.
 */

export class PokemonEspecie {
  generation!: {
    name: string;
  };

  constructor(data?: Partial<PokemonEspecie>) {
    Object.assign(this, data);
  }
}
