/*
 * Componente Pokédex.
 *
 * En esta pantalla el usuario puede:
 * - cargar el listado completo de Pokémon desde PokéAPI
 * - filtrar por tipos y por generación
 * - seleccionar un Pokémon y, al pulsar "Mostrar datos", ver su información y su modelo 3D
 *
 * Para los datos 2D uso PokéAPI y para los modelos 3D uso una API externa de Pokémon 3D.
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { PokeapiService } from '../services/pokeapi.service';

import { ListaPokemon } from '../models/lista-pokemon.model';
import { DetallePokemon } from '../models/detalle-pokemon.model';
import { PokemonEspecie } from '../models/pokemon-especie.model';

import { Pokemon3DService } from '../services/pokemon3D.service';
import { Pokemon3DForm, Pokemon3DItem } from '../models/pokemon3D.model';


import { TIPOS_ES, STATS_ES, GENERACIONES_ES } from '../utils/traducciones-cas';

type GenKey =
  | 'all'
  | 'gen1'
  | 'gen2'
  | 'gen3'
  | 'gen4'
  | 'gen5'
  | 'gen6'
  | 'gen7'
  | 'gen8'
  | 'gen9';

@Component({
  selector: 'app-pokedex',
  standalone: false,
  templateUrl: './pokedex.html',
  styleUrls: ['./pokedex.css'],
})
export class Pokedex implements OnInit {
  /* Lista completa obtenida de la API (se mantiene como referencia). */
  listaCompleta: ListaPokemon[] = [];

  /* Lista que se muestra en pantalla (puede estar filtrada). */
  listaVisible: ListaPokemon[] = [];

  /* Tipos disponibles para los filtros (se cargan desde PokéAPI). */
  tipos: { value: string; label: string }[] = [];
  tipo1: string = '';
  tipo2: string = '';

  /* Generación seleccionada en el filtro. */
  gen: GenKey = 'all';

  /* Opciones de generación que se muestran en el selector. */
  generaciones: { key: GenKey; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'gen1', label: 'Generación I (1–151)' },
    { key: 'gen2', label: 'Generación II (152–251)' },
    { key: 'gen3', label: 'Generación III (252–386)' },
    { key: 'gen4', label: 'Generación IV (387–493)' },
    { key: 'gen5', label: 'Generación V (494–649)' },
    { key: 'gen6', label: 'Generación VI (650–721)' },
    { key: 'gen7', label: 'Generación VII (722–809)' },
    { key: 'gen8', label: 'Generación VIII (810–905)' },
    { key: 'gen9', label: 'Generación IX (906–1025)' },
  ];

  /*
   * Id del Pokémon seleccionado en el desplegable.
   * Importante: el detalle no se carga automáticamente; se carga al pulsar "Mostrar datos".
   */
  seleccionadoId?: number;

  /*
   * Estos dos campos se usan para forzar el refresco del <select> cuando cambian los filtros.
   * Así evito que se quede seleccionado un id que ya no está en la lista filtrada.
   */
  pokemonSelectKey = 0;
  pokemonSeleccionadoValue: string = '';

  /* Datos del Pokémon (detalle y especie) que se muestran en el panel derecho. */
  detalle?: DetallePokemon;
  especie?: PokemonEspecie;

  /* Estado y datos del visor 3D. */
  mostrar3D = false;
  cargando3D = false;
  error3D?: string;
  modelUrl?: string;
  formas3D: Pokemon3DForm[] = [];
  formaSeleccionada?: string; // formName

  /* Estados de carga para mostrar mensajes en la interfaz. */
  cargandoInicial = false;
  cargandoFiltrado = false;
  cargandoDetalle = false;
  cargandoTipos = false;

  /* Mensaje de error general (por ejemplo, al cargar lista o detalle). */
  error?: string;

  /*
   * Caché de ids por tipo.
   * Como los filtros por tipo consultan un endpoint distinto, guardo resultados para no repetir llamadas.
   */
  private cacheTipoIds = new Map<string, number[]>();

  constructor(
    private pokeapi: PokeapiService,
    private cdr: ChangeDetectorRef,
    private pokemon3D: Pokemon3DService
  ) {}

  /*
   * Al iniciar el componente:
   * - cargo los tipos para los filtros
   * - cargo la lista completa para el desplegable
   */
  ngOnInit(): void {
    this.cargarTipos();
    this.cargarListaCompleta();
  }

  /*
   * Carga los tipos desde PokéAPI y los convierte a etiquetas en español.
   * Solo muestro los tipos que están en el diccionario TIPOS_ES.
   */
  cargarTipos(): void {
    this.cargandoTipos = true;

    this.pokeapi
      .getTipos()
      .pipe(finalize(() => {
        this.cargandoTipos = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (t) => {
          this.tipos = t
            .filter((tipo) => TIPOS_ES[tipo])
            .sort()
            .map((tipo) => ({ value: tipo, label: TIPOS_ES[tipo] }));
          this.cdr.detectChanges();
        },
        error: () => {
          this.tipos = [];
          this.cdr.detectChanges();
        },
      });
  }

  /*
   * Carga la lista completa de Pokémon desde PokéAPI.
   * Esta lista se usa como base para filtrar y para mostrar el desplegable.
   */
  cargarListaCompleta(): void {
    this.cargandoInicial = true;
    this.error = undefined;

    this.pokeapi
      .getListaPokemon(1025, 0)
      .pipe(finalize(() => {
        this.cargandoInicial = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.listaCompleta = data;
          this.listaVisible = data;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'No se pudo cargar la lista de Pokémon.';
          this.cdr.detectChanges();
        },
      });
  }

  /*
   * Aplica los filtros seleccionados.
   * - Si solo hay filtro de generación, filtro localmente por id (rango)
   * - Si hay filtro por tipo, necesito consultar PokéAPI para obtener los ids por tipo
   * - Si se eligen dos tipos, me quedo con la intersección (Pokémon que tengan ambos)
   */
  aplicarFiltros(): void {
    // Evitar mismo tipo en ambos
    if (this.tipo1 && this.tipo2 && this.tipo1 === this.tipo2) {
      this.tipo2 = '';
    }

    const hayFiltroTipo = !!this.tipo1 || !!this.tipo2;
    const hayFiltroGen = this.gen !== 'all';

    this.error = undefined;

    // Resetear el select al aplicar filtros (sin borrar detalle actual)
    this.pokemonSeleccionadoValue = '';
    this.pokemonSelectKey++;
    this.seleccionadoId = undefined;
    this.mostrar3D = false;
    this.cargando3D = false;
    this.error3D = undefined;
    this.modelUrl = undefined;
    this.formas3D = [];
    this.formaSeleccionada = undefined;


    // Cargando
    this.cargandoFiltrado = true;
    this.cdr.detectChanges();

    // 1) Sin filtros
    if (!hayFiltroTipo && !hayFiltroGen) {
      this.listaVisible = this.listaCompleta;
      this.cargandoFiltrado = false;
      this.cdr.detectChanges();
      return;
    }

    // 2) Solo filtro por generación (local)
    if (!hayFiltroTipo && hayFiltroGen) {
      const range = this.getGenRange(this.gen);
      this.listaVisible = this.listaCompleta.filter(
        (p) => p.id >= range.min && p.id <= range.max
      );
      this.cargandoFiltrado = false;
      this.cdr.detectChanges();
      return;
    }

    // 3) Filtrado también por tipo de Pokémon (consulta HTTP)
    const peticiones = [];
    if (this.tipo1) peticiones.push(this.getIdsPorTipoConCache(this.tipo1));
    if (this.tipo2) peticiones.push(this.getIdsPorTipoConCache(this.tipo2));

    forkJoin(peticiones)
      .pipe(finalize(() => {
        this.cargandoFiltrado = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (listasIds: number[][]) => {
          let ids: number[];

          if (listasIds.length === 1) {
            ids = listasIds[0];
          } else {
            const set2 = new Set(listasIds[1]);
            ids = listasIds[0].filter((id) => set2.has(id));
          }

          // Aplicar generación si corresponde
          if (hayFiltroGen) {
            const range = this.getGenRange(this.gen);
            ids = ids.filter((id) => id >= range.min && id <= range.max);
          }

          const idSet = new Set(ids);
          this.listaVisible = this.listaCompleta.filter((p) => idSet.has(p.id));

          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Error al aplicar filtros por tipo.';
          this.cdr.detectChanges();
        },
      });
  }

  /*
   * Restaura los filtros a su estado inicial y vuelve a mostrar la lista completa.
   */
  quitarFiltros(): void {
    this.tipo1 = '';
    this.tipo2 = '';
    this.gen = 'all';
    this.aplicarFiltros();
  }

  /*
   * Obtiene los ids por tipo usando caché para evitar llamadas repetidas.
   */
  private getIdsPorTipoConCache(tipo: string) {
    const cached = this.cacheTipoIds.get(tipo);
    if (cached) return of(cached);

    return this.pokeapi.getPokemonIdsPorTipo(tipo).pipe(
      tap((ids) => this.cacheTipoIds.set(tipo, ids))
    );
  }

  /*
   * Guarda el id del Pokémon seleccionado en el desplegable.
   * La carga del detalle se hace solo cuando el usuario pulsa "Mostrar datos".
   */
  onSeleccionarPokemon(value: string): void {
    const id = Number(value);
    if (!Number.isFinite(id) || id <= 0) return;

    this.seleccionadoId = id;

    this.error = undefined;

    this.cdr.detectChanges();
  }

  /*
   * Al pulsar el botón "Mostrar datos" lanzo:
   * - la carga del detalle (PokéAPI)
   * - y la carga del modelo 3D (API externa)
   */
  mostrarDatosY3D(): void {
    if (!this.seleccionadoId) {
      this.error = 'Selecciona un Pokémon primero.';
      this.error3D = 'Selecciona un Pokémon primero.';
      this.cdr.detectChanges();
      return;
    }

    // Lanzar ambas cosas (cada una gestiona su propia carga de datos)
    this.mostrarDatos();
    this.render3D();
  }

  /*
   * Carga el detalle del Pokémon y su especie (para conocer la generación).
   * Uso forkJoin para hacer ambas peticiones a la vez.
   */
  mostrarDatos(): void {
    if (!this.seleccionadoId) {
      this.error = 'Selecciona un Pokémon primero.';
      this.cdr.detectChanges();
      return;
    }

    const id = this.seleccionadoId;

    this.cargandoDetalle = true;
    this.error = undefined;
    this.detalle = undefined;
    this.especie = undefined;
    this.cdr.detectChanges();

    forkJoin({
      detalle: this.pokeapi.getDetallePokemon(id),
      especie: this.pokeapi.getEspeciePokemon(id),
    })
      .pipe(finalize(() => {
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: ({ detalle, especie }) => {
          this.detalle = detalle;
          this.especie = especie;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'No se pudieron cargar los datos del Pokémon.';
          this.cdr.detectChanges();
        },
      });
  }

  /*
   * Traducciones usadas en la vista para mostrar valores en castellano.
   * Si no existe traducción, muestro el valor original.
   */
  getTipoES(tipo: string): string {
    return TIPOS_ES[tipo] ?? tipo;
  }

  getStatES(stat: string): string {
    return STATS_ES[stat] ?? stat;
  }

  getGeneracionES(gen: string): string {
    return GENERACIONES_ES[gen] ?? gen;
  }

  /*
   * Devuelve el rango de ids asociado a cada generación.
   * Como PokéAPI tiene el orden nacional, puedo filtrar por id sin pedir más datos.
   */
  private getGenRange(gen: GenKey): { min: number; max: number } {
    switch (gen) {
      case 'gen1': return { min: 1, max: 151 };
      case 'gen2': return { min: 152, max: 251 };
      case 'gen3': return { min: 252, max: 386 };
      case 'gen4': return { min: 387, max: 493 };
      case 'gen5': return { min: 494, max: 649 };
      case 'gen6': return { min: 650, max: 721 };
      case 'gen7': return { min: 722, max: 809 };
      case 'gen8': return { min: 810, max: 905 };
      case 'gen9': return { min: 906, max: 1025 };
      default: return { min: 1, max: 1025 };
    }
  }

  /*
   * Carga el modelo 3D desde la API externa.
   * Si hay varias formas disponibles (shiny, regional, etc.), se guardan para los botones.
   */
  render3D(): void {
    if (!this.seleccionadoId) {
      this.error3D = 'Selecciona un Pokémon primero.';
      this.cdr.detectChanges();
      return;
    }

    this.cargando3D = true;
    this.mostrar3D = false;
    this.error3D = undefined;
    this.modelUrl = undefined;
    this.formas3D = [];
    this.formaSeleccionada = undefined;
    this.cdr.detectChanges();

    const id = this.seleccionadoId;

    this.pokemon3D.getPokemon3dById(id).subscribe({
      next: (item: Pokemon3DItem | undefined) => {
        if (!item || !item.forms || item.forms.length === 0) {
          this.error3D = 'No hay modelo 3D disponible para este Pokémon en la API.';
          this.cargando3D = false;
          this.cdr.detectChanges();
          return;
        }

        this.formas3D = item.forms;

        const preferred =
          item.forms.find((f: Pokemon3DForm) => f.formName === 'regular') ?? item.forms[0];

        this.formaSeleccionada = preferred.formName;
        this.modelUrl = preferred.model;

        this.mostrar3D = true;
        this.cargando3D = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Error 3D:', err);
        this.error3D = 'Error al cargar el modelo 3D desde la API.';
        this.cargando3D = false;
        this.cdr.detectChanges();
      }
    });
  }

  /*
   * Cambia la forma seleccionada en el visor 3D (por ejemplo: shiny o mega).
   */
  cambiarForma3D(formName: string): void {
    const f = this.formas3D.find(x => x.formName === formName);
    if (!f) return;

    this.formaSeleccionada = formName;
    this.modelUrl = f.model;
    this.cdr.detectChanges();
  }

  /*
   * Devuelve el tipo principal del Pokémon (el primer tipo del array).
   * Lo uso para aplicar una clase CSS que cambia el fondo del panel de información.
   */
  getTipoPrincipal(): string | undefined {
    return this.detalle?.types?.[0]?.type?.name;
  }

  getTipoClasePrincipal(): string {
   const t = this.getTipoPrincipal();
    return t ? `tipo-${t}` : 'tipo-default';
  }

}
