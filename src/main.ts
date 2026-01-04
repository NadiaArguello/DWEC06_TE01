/*
 * Punto de entrada de PokéMundo en el navegador.
 * Inicializa Angular y arranca el módulo principal de la aplicación.
 */
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

platformBrowser().bootstrapModule(AppModule, {
  
})
  .catch(err => console.error(err));
