/*
 * Modelo principal de detalle de un Pokémon.
 * Este modelo representa la respuesta del endpoint /pokemon/{id|name} de PokéAPI.
 * Lo uso cuando el usuario selecciona un Pokémon en la lista para mostrar sus datos y stats.
 */

import {
  TipoPokemon,
  EstadisticasPokemon,
  ImagenesPokemon
} from './auxiliares.model';

export class DetallePokemon {
  id!: number;
  name!: string;
  height!: number;
  weight!: number;

  types!: TipoPokemon[];
  stats!: EstadisticasPokemon[];
  sprites!: ImagenesPokemon;

   /*
   * Uso un constructor con Partial para poder crear el objeto fácilmente
   * a partir del JSON devuelto por la API (Object.assign copia las propiedades).
   */
  constructor(data?: Partial<DetallePokemon>) {
    Object.assign(this, data);
  }
}

