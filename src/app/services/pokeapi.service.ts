/*
 * Servicio para consultar PokéAPI.
 * La idea es que el componente Pokedex no se preocupe por URLs ni por transformar respuestas,
 * sino que llame a estos métodos y reciba datos ya listos para usar.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ListaPokemon } from '../models/lista-pokemon.model';
import { DetallePokemon } from '../models/detalle-pokemon.model';
import { PokemonEspecie } from '../models/pokemon-especie.model';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  /*
   * Obtiene una lista de Pokémon y la transforma para mi listado.
   * PokéAPI devuelve name + url, y yo a partir de esa url saco el id y genero el sprite.
   */
  getListaPokemon(limit: number = 1025, offset: number = 0): Observable<ListaPokemon[]> {
    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;

    return this.http.get<any>(url).pipe(
      map(resp => resp.results as Array<{ name: string; url: string }>),
      map(results =>
        results
          .map(r => {
            const id = this.extraerIdDesdeUrl(r.url);
            return new ListaPokemon({
              id,
              name: r.name,
              sprite: this.spritePorId(id),
            });
          })
          .sort((a, b) => a.id - b.id)
      )
    );
  }

  /*
   * Obtiene el detalle de un Pokémon cuando el usuario lo selecciona.
   * Acepta id o nombre, porque PokéAPI permite ambas formas.
   */
  getDetallePokemon(idOrName: number | string): Observable<DetallePokemon> {
    const url = `${this.baseUrl}/pokemon/${idOrName}`;
    return this.http.get<any>(url).pipe(
      map(data => new DetallePokemon(data))
    );
  }

  /*
   * Obtiene datos de especie. En mi caso lo uso para saber a qué generación pertenece el Pokémon.
   */
  getEspeciePokemon(idOrName: number | string): Observable<PokemonEspecie> {
    const url = `${this.baseUrl}/pokemon-species/${idOrName}`;
    return this.http.get<any>(url).pipe(
      map(data => new PokemonEspecie(data))
    );
  }

  /* Devuelve el listado de tipos disponibles para rellenar el filtro por tipo. */
  getTipos(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/type`).pipe(
      map(r => (r.results as Array<{ name: string }>).map(t => t.name))
    );
  }

  /*
   * Devuelve los IDs de Pokémon que pertenecen a un tipo.
   * Esto me sirve para filtrar la lista sin tener que pedir el detalle de cada Pokémon.
   */
  getPokemonIdsPorTipo(typeName: string): Observable<number[]> {
    const url = `${this.baseUrl}/type/${typeName}`;
    return this.http.get<any>(url).pipe(
      map(r => r.pokemon as Array<{ pokemon: { name: string; url: string } }>),
      map(list =>
        list
          .map(item => this.extraerIdDesdeUrl(item.pokemon.url))
          .filter(id => Number.isFinite(id))
      )
    );
  }

  /*
   * PokéAPI suele devolver urls que terminan en /{id}/.
   * Con este helper saco el número final para poder usarlo en la app.
   */
  private extraerIdDesdeUrl(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
  }

  /*
   * En el listado uso sprites (imágenes 2D pequeñas) oficiales alojados en GitHub.
   * Con el id construyo directamente la URL de la imagen.
   */
  private spritePorId(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
}
