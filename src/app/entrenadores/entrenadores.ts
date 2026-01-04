/*
 * Componente Entrenadores (listado).
 *
 * Esta pantalla muestra todos los entrenadores guardados en la Mock API.
 * Además de los datos del entrenador, enseño una previsualización del Pokémon favorito
 * usando sprites sacados de PokéAPI.
 *
 * Operaciones disponibles desde el listado:
 * - Ver detalle del entrenador
 * - Editar entrenador
 * - Borrar entrenador (con confirmación)
 * - Crear entrenador nuevo (botón superior)
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { EntrenadoresService } from '../services/entrenadores.service';
import { Entrenador as EntrenadorModel } from '../models/entrenador.model';
import { PokeapiService } from '../services/pokeapi.service';
import { ListaPokemon } from '../models/lista-pokemon.model';

@Component({
  selector: 'app-entrenadores',
  standalone: false,
  templateUrl: './entrenadores.html',
  styleUrls: ['./entrenadores.css'],
})
export class Entrenadores implements OnInit {
  items: EntrenadorModel[] = [];

  /* Estados de la interfaz para mostrar carga y errores. */
  cargando = false;
  error?: string;

  /*
   * Relación del nombre con el sprite.
   * La uso para poder mostrar rápidamente el sprite del Pokémon favorito de cada entrenador.
   */
  private spriteByName = new Map<string, string>();

  constructor(
    private service: EntrenadoresService,
    private pokeapi: PokeapiService,
    private cdr: ChangeDetectorRef
  ) {}

  /*
   * Al entrar en la pantalla:
   * - cargo el listado de entrenadores
   * - y cargo una lista de Pokémon para poder sacar sprites por nombre
   */
  ngOnInit(): void {
    this.cargar();
    this.cargarSpritesPokemon();
  }

  /*
   * Consulta GET al servicio para obtener todos los entrenadores.
   */
  cargar(): void {
    this.cargando = true;
    this.error = undefined;
    this.cdr.detectChanges();

    this.service.getAll()
      .pipe(finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.items = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error GET All entrenadores:', err);
          this.error = 'No se pudo cargar la lista de entrenadores.';
          this.cdr.detectChanges();
        },
      });
  }

  /*
   * Borra un entrenador tras confirmación del usuario.
   * Al terminar, recargo la lista para que la vista se actualice.
   */
  borrar(entrenador: EntrenadorModel): void {
    const nombreCompleto = `${entrenador.nombre} ${entrenador.apellidos}`;

    const confirmado = window.confirm(
      `¿Seguro que quieres borrar al entrenador ${nombreCompleto}?\n\nEsta acción no se puede deshacer.`
    );

  if (!confirmado) return;
    this.service.delete(entrenador.id!).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        console.error('Error DELETE entrenador:', err);
        this.error = 'No se pudo borrar el entrenador.';
        this.cdr.detectChanges();
      },
    });
  }

  /*
   * Descarga una vez la lista de Pokémon y guarda un mapa nombre->sprite.
   * Con esto puedo mostrar el sprite del favorito sin pedir detalle de cada Pokémon.
   */
  private cargarSpritesPokemon(): void {
    this.pokeapi.getListaPokemon(1025, 0).subscribe({
      next: (lista: ListaPokemon[]) => {
        this.spriteByName.clear();
        for (const p of lista) {
          this.spriteByName.set(p.name.toLowerCase(), p.sprite);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando lista pokemon (sprites):', err);
      }
    });
  }

  /*
   * Devuelve el sprite asociado al nombre del Pokémon favorito.
   * Si el nombre no existe en el mapa o viene vacío, no muestro nada en la tarjeta.
   */
  getSpriteFavorito(nombre: string | undefined): string | undefined {
    if (!nombre) return undefined;
    const key = nombre.trim().toLowerCase();
    return this.spriteByName.get(key);
  }


}
