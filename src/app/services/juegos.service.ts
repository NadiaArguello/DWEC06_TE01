/**
 * Servicio de juegos (fuente local).
 *
 * En esta sección del proyecto no uso API externa: simulo una capa de datos como si fuese una API,
 * pero devolviendo Observables a partir de un catálogo local (JUEGOS_DATA).
 * Esto me permite mantener la misma estructura que en otras partes de la aplicación (servicio + modelo).
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Juego } from '../models/juego.model';
import { JUEGOS_DATA } from '../data/juegos.data';

@Injectable({ providedIn: 'root' })
export class JuegosService {
    /** Devuelve el catálogo completo de juegos. */
    getAll(): Observable<Juego[]> {
    return of(JUEGOS_DATA);
  }

  /** Devuelve un juego concreto por id (si existe). */
  getById(id: number): Observable<Juego | undefined> {
    return of(JUEGOS_DATA.find(j => j.id === id));
  }
}
