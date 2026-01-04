/*
 * Servicio para trabajar con entrenadores en la Mock API.
 * Aquí centralizo todas las llamadas HTTP para no repetir código en los componentes.
 *
 * Desde los componentes lo uso para:
 * - listar entrenadores
 * - ver uno por id
 * - crear, editar y borrar entrenadores (CRUD)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrenador } from '../models/entrenador.model';

@Injectable({ providedIn: 'root' })
export class EntrenadoresService {
  private readonly baseUrl = 'https://694ad9fb26e870772066bff3.mockapi.io/api/entrenadores';

  constructor(private http: HttpClient) {}


  // GET All. Devuelve todos los entrenadores para mostrarlos en el listado.
  getAll(): Observable<Entrenador[]> {
    return this.http.get<Entrenador[]>(this.baseUrl);
  }

  // GET ById. Devuelve un entrenador concreto para la vista de detalle.
  getById(id: string): Observable<Entrenador> {
    return this.http.get<Entrenador>(`${this.baseUrl}/${id}`);
  }

  // POST. Crea un entrenador nuevo (se usa desde el formulario en modo "nuevo").
  create(entrenador: Entrenador): Observable<Entrenador> {
    return this.http.post<Entrenador>(this.baseUrl, entrenador);
  }

  // PUT. Actualiza un entrenador existente (se usa desde el formulario en modo "editar").
  update(id: string, entrenador: Entrenador): Observable<Entrenador> {
    return this.http.put<Entrenador>(`${this.baseUrl}/${id}`, entrenador);
  }

  // DELETE. Borra un entrenador del listado.
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
