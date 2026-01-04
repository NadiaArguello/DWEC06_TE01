/*
 * En este fichero guardo modelos auxiliares que uso dentro del detalle de un Pokémon.
 * PokéAPI devuelve objetos anidados (por ejemplo, tipos y estadísticas), y con estas clases
 * me resulta más fácil tipar la respuesta y acceder a los campos desde Angular.
 */

export class TipoPokemon {
  slot!: number; // PokéAPI usa "slot" para indicar si es tipo principal (1) o secundario (2).
  // Dentro de "type" vienen varios datos, pero en la app uso "name".
  type!: {
    name: string;
  };
}

export class EstadisticasPokemon {
  base_stat!: number; // Valor base de la estadística (PS, ataque, defensa, etc.).
  // En "stat.name" viene el nombre de la estadística tal y como lo define PokéAPI.
  stat!: {
    name: string;
  };
}

export class ImagenesPokemon {
  // Sprites (imágenes pequeñas) del Pokémon en su versión normal y shiny.
  front_default!: string;
  front_shiny!: string;
  /*
   * PokéAPI también devuelve sprites alternativos dentro de "other".
   * En mi caso uso "home" cuando existe, porque tiene mejor calidad.
   * Lo marco como opcional porque no siempre están todas las rutas disponibles.
   */
  other?: {
    home?: {
      front_default?: string;
      front_shiny?: string;
    };
  };
}
