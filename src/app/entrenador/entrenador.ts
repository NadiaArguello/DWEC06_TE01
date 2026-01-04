/*
 * Componente Entrenador (detalle).
 *
 * Muestra la información de un entrenador concreto, cuyo id viene en la URL.
 * Además, carga un sprite del Pokémon favorito para acompañar el detalle.
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { EntrenadoresService } from '../services/entrenadores.service';
import { Entrenador as EntrenadorModel } from '../models/entrenador.model';
import { PokeapiService } from '../services/pokeapi.service';
import { ListaPokemon } from '../models/lista-pokemon.model';


@Component({
  selector: 'app-entrenador',
  standalone: false,
  templateUrl: './entrenador.html',
  styleUrls: ['../entrenadores/entrenadores.css'],
})
export class Entrenador implements OnInit {
  item?: EntrenadorModel;

  cargando = false;
  error?: string;
  id?: string;

  spriteFavorito?: string;
  cargandoPokemon = false;


  constructor(
    private route: ActivatedRoute,
    private service: EntrenadoresService,
    private pokeapi: PokeapiService,
    private cdr: ChangeDetectorRef
  ) {}

  /*
   * Recupero el id desde la ruta y cargo el detalle.
   * Si el id no existe, muestro un error porque no puedo pedir el entrenador.
   */
  ngOnInit(): void {
    
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (!this.id) {
      this.error = 'No se recibió el ID del entrenador en la URL.';
      this.cdr.detectChanges();
      return;
    }

    this.cargarDetalle(this.id);
  }

  /*
   * Consulta GET ById para cargar el entrenador y, cuando llega,
   * inicia también la carga del sprite del Pokémon favorito.
   */
  private cargarDetalle(id: string): void {
    this.cargando = true;
    this.error = undefined;
    this.item = undefined;
    this.cdr.detectChanges();

    this.service.getById(id)
      .pipe(finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.item = data;
          this.cargarSpriteFavorito(this.item.pokemonFavorito);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error GET ById entrenador:', err);
          this.error = 'No se pudo cargar el entrenador (GET ById).';
          this.cdr.detectChanges();
        }
      });
  }

  /*
   * Busca el sprite del Pokémon favorito a partir de su nombre.
   * En este componente vuelvo a pedir la lista completa para localizar el sprite.
   */
  private cargarSpriteFavorito(nombre: string | undefined): void {
    if (!nombre) {
      this.spriteFavorito = undefined;
      this.cdr.detectChanges();
      return;
    }

    const key = nombre.trim().toLowerCase();
    this.cargandoPokemon = true;
    this.cdr.detectChanges();

    this.pokeapi.getListaPokemon(1025, 0)
      .pipe(finalize(() => {
        this.cargandoPokemon = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (lista: ListaPokemon[]) => {
          const encontrado = lista.find(p => p.name === key);
          this.spriteFavorito = encontrado?.sprite;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando sprite favorito:', err);
          this.spriteFavorito = undefined;
          this.cdr.detectChanges();
        }
      });
  }

}
