/*
 * Configuración central de rutas de PokéMundo.
 *
 * Incluye rutas principales y rutas específicas de entrenadores:
 * - Listado, detalle por id y formulario (nuevo / editar)
 *
 * Importante: la ruta comodín '**' debe ir siempre al final.
 */
import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Route } from "@angular/router";

import { Pokedex } from "./pokedex/pokedex";
import { Juegos } from "./juegos/juegos";
import { Home } from "./home/home";
import { Entrenadores } from "./entrenadores/entrenadores";
import { Entrenador } from "./entrenador/entrenador";
import { EntrenadorForm } from "./entrenador-form/entrenador-form";

const appRoutes: Routes = [
    {path:'pokedex', component: Pokedex},
    {path:'juegos', component: Juegos},
    {path:'home', component: Home},
    {path:'entrenadores', component: Entrenadores},
    { path: 'entrenadores/nuevo', component: EntrenadorForm },
    { path: 'entrenadores/:id', component: Entrenador },
    { path: 'entrenadores/:id/editar', component: EntrenadorForm },
    {path:'**', component: Home},
];

export const appRoutingProviders: any[] = [];

/*
 * Export de RouterModule ya configurado para importarlo directamente en AppModule.
 * Igual que en los videotutoriales del curso
*/
export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(appRoutes);
