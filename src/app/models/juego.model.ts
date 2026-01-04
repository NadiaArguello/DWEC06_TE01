/*
 * Modelo de Juego.
 * Lo utilizo en el componente Juegos para representar cada juego de Pokémon con sus datos.
 * Aunque en mi proyecto los juegos están en un array local, tener el modelo me ayuda
 * a mantener el tipado y que el componente sea más limpio.
 */

export class Juego {
  id!: number;
  nombre!: string;
  generacion!: string;
  plataforma!: string;
  anio!: number;
  region!: string;
  portada!: string;

  constructor(data?: Partial<Juego>) {
    Object.assign(this, data);
  }
}
