/*
 * Componente Juegos.
 *
 * En esta pantalla muestro un catálogo de juegos de Pokémon en forma de tarjetas.
 * Los datos no vienen de una API externa: se obtienen desde un servicio local (JuegosService),
 * que devuelve un catálogo definido en un fichero de datos.
 *
 * Sobre ese catálogo aplico filtros por texto, generación, consola y región.
 * La idea es que el usuario pueda buscar rápido juegos concretos y ver información básica
 * (generación, plataforma, año y región) junto a la portada.
 */

import { Component, OnInit } from '@angular/core';
import { Juego } from '../models/juego.model';
import { JuegosService } from '../services/juegos.service';

type FiltroKey = 'all' | string;

@Component({
  selector: 'app-juegos',
  standalone: false,
  templateUrl: './juegos.html',
  styleUrls: ['./juegos.css'],
})
export class Juegos implements OnInit {

  /* Lista completa de juegos (catálogo). */
  juegos: Juego[] = [];

  /* Lista que se pinta en pantalla (resultado de aplicar filtros). */
  juegosFiltrados: Juego[] = [];

  /* Texto libre para buscar por nombre, región o consola. */
  texto = '';

  /* Filtros seleccionados. El valor 'all' indica que no se filtra por ese campo. */
  gen: FiltroKey = 'all';
  consola: FiltroKey = 'all';
  region: FiltroKey = 'all';

  /*
   * Opciones de los desplegables.
   * Se generan automáticamente a partir del catálogo para no escribirlas “a mano”.
   */
  generaciones: string[] = [];
  consolas: string[] = [];
  regiones: string[] = [];

  /* Inyecto el servicio que proporciona el catálogo de juegos. */
  constructor(private juegosService: JuegosService) {}

  /*
   * Al iniciar el componente:
   * - cargo el catálogo de juegos desde el servicio
   * - reconstruyo las opciones de filtros (valores únicos)
   * - aplico filtros para que al empezar se muestre todo
  */
  ngOnInit(): void {
    this.juegosService.getAll().subscribe(data => {
      this.juegos = data;
      this.reconstruirOpciones();
      this.aplicarFiltros();
    });
  }

  /*
   * Genera las opciones de los selects (generaciones, consolas y regiones)
   * a partir de los valores que existen en el catálogo.
   */
  private reconstruirOpciones(): void {
    const uniq = (arr: string[]) => Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));

    this.generaciones = uniq(this.juegos.map(j => j.generacion).filter(Boolean));
    this.consolas = uniq(this.juegos.map(j => j.plataforma).filter(Boolean));
    this.regiones = uniq(this.juegos.map(j => j.region).filter(Boolean));
  }

  /*
   * Aplica todos los filtros sobre la lista.
   * - El filtro de texto busca en nombre, consola y región
   * - Los selects filtran por coincidencia exacta (o "all" si no se filtra)
   */
  aplicarFiltros(): void {
    const t = this.texto.trim().toLowerCase();

    this.juegosFiltrados = this.juegos.filter(j => {
      const pasaTexto =
        !t ||
        j.nombre.toLowerCase().includes(t) ||
        j.plataforma.toLowerCase().includes(t) ||
        j.region.toLowerCase().includes(t);

      const pasaGen = this.gen === 'all' || j.generacion === this.gen;
      const pasaConsola = this.consola === 'all' || j.plataforma === this.consola;
      const pasaRegion = this.region === 'all' || j.region === this.region;

      return pasaTexto && pasaGen && pasaConsola && pasaRegion;
    });
  }

  /*
   * Restablece los filtros y vuelve a mostrar todo el catálogo.
   */
  limpiar(): void {
    this.texto = '';
    this.gen = 'all';
    this.consola = 'all';
    this.region = 'all';
    this.aplicarFiltros();
  }
}