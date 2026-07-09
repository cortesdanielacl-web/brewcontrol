/** Deriva la ruta WebP equivalente para una imagen de la landing. */
export function toWebpSrc(src: string): string {
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

/** Banco de imágenes de la landing — colocar archivos en public/landing/photos/ */
export const LANDING_PHOTOS = {
  /** Hero — cervecero trabajando con BrewControl en el notebook */
  heroCostAnalysis: '/landing/photos/hero-prota.png',
  /** Problema — costeo manual (libreta, recetas, calculadora) */
  notebookCalculations: '/landing/photos/libreta-calculos.jpg',
  /** Solución — notebook con BrewControl (dashboard protagonista) */
  dashboard: '/landing/photos/notebook-brewcontrol.jpg',
  /** Producción — cervecero agregando lúpulo a la olla */
  production: '/landing/photos/sala-coccion.jpg',
  /** Resultado — receta rentable (cervecero, notebook, dashboard, cajas, botellas, barriles) */
  finalResult: '/landing/photos/lote-rentable.jpg',
  /** @deprecated Usar `production`. Mantenido por compatibilidad. */
  brewKettle: '/landing/photos/sala-coccion.jpg',
  ingredients: '/landing/photos/ingredientes.jpg',
  brewerWorking: '/landing/photos/cervecero-trabajando.jpg',
  /** @deprecated Usar `dashboard`. Mantenido por compatibilidad. */
  notebookBrewControl: '/landing/photos/notebook-brewcontrol.jpg',
  /** @deprecated Usar `finalResult`. Mantenido por compatibilidad. */
  beerServed: '/landing/photos/lote-rentable.jpg',
} as const;

export const LANDING_SCREENSHOTS = {
  dashboard: '/landing/screenshots/dashboard.png',
  evaluation: '/landing/screenshots/evaluacion.png',
  history: '/landing/screenshots/historial.png',
  config: '/landing/screenshots/configuracion.png',
} as const;
