/*
 * Componente EntrenadorForm.
 *
 * Se reutiliza para dos casos:
 * - Crear un entrenador nuevo (POST)
 * - Editar un entrenador existente (PUT) cuando hay un id en la URL
 *
 * Además, carga la lista de Pokémon para que el usuario pueda elegir su favorito
 * y se muestra una previsualización del sprite.
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { EntrenadoresService } from '../services/entrenadores.service';
import { Entrenador } from '../models/entrenador.model';

import { PokeapiService } from '../services/pokeapi.service';
import { ListaPokemon } from '../models/lista-pokemon.model';

@Component({
  selector: 'app-entrenador-form',
  standalone: false,
  templateUrl: './entrenador-form.html',
  styleUrls: ['../entrenadores/entrenadores.css'],
})
export class EntrenadorForm implements OnInit {

  /*
   * Modelo enlazado al formulario (ngModel).
   * En modo "nuevo" comienza con valores por defecto.
   */
  model: Entrenador = new Entrenador({
    nombre: '',
    apellidos: '',
    edad: 10,
    region: '',
    pokemonFavorito: '',
    avatar: '',
  });

  /* Lista de Pokémon para el desplegable de favorito. */
  listaPokemon: ListaPokemon[] = [];
  cargandoPokemon = false;
  errorPokemon?: string;

  /* Sprite del Pokémon favorito seleccionado (se usa como preview). */
  spriteFavorito?: string;

  /* Modo edición si existe id en la URL. */
  editMode = false;

  /* Estados de pantalla y guardado. */
  cargando = false;
  guardando = false;
  error?: string;

  private id?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: EntrenadoresService,
    private pokeapi: PokeapiService,
    private cdr: ChangeDetectorRef
  ) {}

  /*
   * Al iniciar:
   * - cargo la lista de Pokémon para el select
   * - compruebo si hay id en la ruta para saber si estoy editando
   * - si es edición, precargo el entrenador en el formulario
   */
  ngOnInit(): void {
    // Carga lista de Pokémon para el desplegable
    this.cargarListaPokemon();

    // Si hay id pasa a modo edición
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.editMode = !!this.id;

    if (this.editMode && this.id) {
      this.cargarParaEditar(this.id);
    }
  }

  /*
   * Carga la lista de Pokémon desde PokéAPI para rellenar el desplegable.
   * También sirve para poder sacar el sprite y mostrarlo como previsualización.
   */
  private cargarListaPokemon(): void {
    this.cargandoPokemon = true;
    this.errorPokemon = undefined;
    this.cdr.detectChanges();

    /*
     *He limitado la lista de Pokémon a 1025, que son los que existen actualmente.
     *Si se ralentiza mucho la página, puede reducirse el número para que no pase como en la Tarea de la UD04, que la carga iba lenta.
     *Pero en las pruebas que he hecho hasta ahora carga bien, es ligera.
     */
    this.pokeapi.getListaPokemon(1025, 0)
      .pipe(finalize(() => {
        this.cargandoPokemon = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.listaPokemon = data;
          // Si ya había favorito (por edición o por lo que sea), actualiza sprite
          this.onPokemonFavoritoChange(this.model.pokemonFavorito);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando lista de Pokémon:', err);
          this.errorPokemon = 'No se pudo cargar la lista de Pokémon.';
          this.cdr.detectChanges();
        }
      });
  }

  /*
   * En modo edición, consulta el entrenador por id y precarga el formulario.
   * Normalizo el nombre del Pokémon favorito para que coincida con los nombres de PokéAPI.
   */
  private cargarParaEditar(id: string): void {
    this.cargando = true;
    this.error = undefined;
    this.cdr.detectChanges();

    this.service.getById(id)
      .pipe(finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          //Precarga los datos en el formulario
          this.model = new Entrenador(data);

          //Normaliza pokemonFavorito
          if (this.model.pokemonFavorito) {
            this.model.pokemonFavorito = this.model.pokemonFavorito
              .trim()
              .toLowerCase();
          }

          //Mostrar preview del sprite
          this.onPokemonFavoritoChange(this.model.pokemonFavorito);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error precargando entrenador:', err);
          this.error = 'No se pudo cargar el entrenador para editar.';
          this.cdr.detectChanges();
        }
      });
  }

  /*
   * Cuando cambia el Pokémon favorito en el select,
   * busco su sprite en la lista cargada y actualizo la imagen de previsualización.
   */
  onPokemonFavoritoChange(nombre: string): void {
    if (!nombre || !this.listaPokemon.length) {
      this.spriteFavorito = undefined;
      this.cdr.detectChanges();
      return;
    }

    const key = nombre.trim().toLowerCase();         // ✅ normaliza
    const encontrado = this.listaPokemon.find(p => p.name === key);

    this.spriteFavorito = encontrado?.sprite;
    this.cdr.detectChanges();
  }

  /*
   * Envía el formulario:
   * - si es edición -> PUT
   * - si es nuevo -> POST
   * Al finalizar vuelvo al listado de entrenadores.
   */
  guardar(form: any): void {
    if (form.invalid) return;

    this.error = undefined;
    this.guardando = true;
    this.cdr.detectChanges();

    const req$ = (this.editMode && this.id)
      ? this.service.update(this.id, this.model)
      : this.service.create(this.model);

    req$
      .pipe(finalize(() => {
        this.guardando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => this.router.navigate(['/entrenadores']),
        error: (err) => {
          console.error('Error guardando entrenador:', err);
          this.error = 'Error al guardar (POST/PUT).';
          this.cdr.detectChanges();
        }
      });
  }

  /* Vuelve al listado sin guardar cambios. */
  cerrar(): void {
    this.router.navigate(['/entrenadores']);
  }
}
