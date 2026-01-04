/*
 * Modelos para la API de Pokémon 3D.
 * La API devuelve, para cada Pokémon, un id y varias "formas" (shiny, mega, regional...).
 * Con estas clases lo tipamos y luego en el componente puedo cambiar de forma con botones.
 */

export class Pokemon3DForm {
  name!: string;
  model!: string;
  formName!: string;

  constructor(data?: Partial<Pokemon3DForm>) {
    Object.assign(this, data);
  }
}

export class Pokemon3DItem {
  id!: number;
  forms!: Pokemon3DForm[];

  constructor(data?: Partial<Pokemon3DItem>) {
    Object.assign(this, data);
  }
}

export class Pokemon3DResponse {
  pokemon!: Pokemon3DItem[];

  constructor(data?: Partial<Pokemon3DResponse>) {
    Object.assign(this, data);
  }
}
