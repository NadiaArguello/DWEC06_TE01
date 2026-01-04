import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Configuración de rutas para SSR/Prerender.
 *
 * - Prerender: genera HTML estático en build.
 * - Server: renderiza en servidor bajo demanda (sin generar HTML en build).
 *
 * Importante:
 * - TODAS las rutas del router de Angular deben estar representadas aquí.
 * - Si una ruta tiene parámetros (ej. :id) y está en Prerender, debe definir getPrerenderParams.
 */
export const serverRoutes: ServerRoute[] = [
  // Rutas estáticas (sin parámetros) -> Prerender
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'pokedex', renderMode: RenderMode.Prerender },
  { path: 'juegos', renderMode: RenderMode.Prerender },
  { path: 'entrenadores', renderMode: RenderMode.Prerender },
  { path: 'entrenadores/nuevo', renderMode: RenderMode.Prerender },

  // Ruta dinámica -> Prerender con params (requiere getPrerenderParams)
  {
    path: 'entrenadores/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const res = await fetch(
        'https://694ad9fb26e870772066bff3.mockapi.io/api/entrenadores'
      );
      const data = await res.json();
      return data.map((e: any) => ({ id: e.id }));
    },
  },

  { path: 'entrenadores/:id/editar', renderMode: RenderMode.Server },

  { path: '**', renderMode: RenderMode.Server },
];
