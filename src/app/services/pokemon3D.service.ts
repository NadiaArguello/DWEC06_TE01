/*
 * Servicio para la API de Pokémon 3D.
 * Esta API devuelve un catálogo grande con modelos y formas.
 *
 * En lugar de pedir cada Pokémon por separado, lo descargo una vez y lo guardo en caché
 * (shareReplay), y luego busco por id cuando el usuario selecciona un Pokémon.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Pokemon3DItem } from '../models/pokemon3D.model';

@Injectable({ providedIn: 'root' })
export class Pokemon3DService {
  private readonly baseUrl = 'https://pokemon-3d-api.onrender.com/v1/pokemon';

  private readonly data$: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.data$ = this.http.get<any>(this.baseUrl).pipe(
      map((res: any) => (Array.isArray(res) ? res : res?.pokemon ?? [])),
      shareReplay(1)
    );
  }

  /*
   * Busca en el catálogo el Pokémon con el id indicado.
   * Si no existe en la API 3D, devuelve undefined.
   */
  getPokemon3dById(id: number): Observable<Pokemon3DItem | undefined> {
    return this.data$.pipe(
      map((arr: any[]) => arr.find((p: any) => Number(p.id) === id))
    );
  }
}

