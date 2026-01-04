/*
 * Módulo raíz de PokéMundo.
 *
 * Declara los componentes principales y configura:
 * - Router de la aplicación
 * - HttpClient para consumo de APIs
 * - FormsModule para formularios template-driven
 * - Soporte para Web Components (<model-viewer>) mediante CUSTOM_ELEMENTS_SCHEMA
 */
import { NgModule, provideBrowserGlobalErrorListeners, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './app-routing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Pokedex } from './pokedex/pokedex';
import { Juegos } from './juegos/juegos';
import { Home } from './home/home';
import { Entrenadores } from './entrenadores/entrenadores';
import { Entrenador } from './entrenador/entrenador';
import { EntrenadorForm } from './entrenador-form/entrenador-form';

@NgModule({
  declarations: [
    App,
    Pokedex,
    Juegos,
    Home,
    Entrenadores,
    Entrenador,
    EntrenadorForm
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    appRoutingProviders
  ],
  bootstrap: [App],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
