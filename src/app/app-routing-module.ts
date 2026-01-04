/*
 * Módulo de routing “vacío”.
 *
 * Nota: en este proyecto las rutas reales se configuran en `app-routing.ts, como en los videotutoriales`
 * mediante el export `routing` (RouterModule.forRoot(appRoutes)).
 *
 * Este módulo se mantiene por compatibilidad/estructura del proyecto, pero no define rutas.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
