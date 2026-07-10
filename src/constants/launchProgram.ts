/**
 * Configuración del lanzamiento y Programa Fundadores.
 * Ajustar aquí cupos, precio y fase actual sin tocar la UI.
 */

/** Cupos totales del Batch Fundador (configurable). */
export const FOUNDER_SLOT_LIMIT = 20;

/** Precio mensual del plan Fundador en CLP. */
export const FOUNDER_PRICE_CLP = 9_990;

/**
 * Fase comercial del producto.
 * - beta: Beta en curso
 * - fundadores: Programa Fundadores
 * - comercial: Comercial
 */
export type LaunchPhase = 'beta' | 'fundadores' | 'comercial';

/** Fase activa del lanzamiento (fuente de verdad para el dashboard ejecutivo). */
export const CURRENT_LAUNCH_PHASE: LaunchPhase = 'beta';

export const LAUNCH_PHASE_LABELS: Record<LaunchPhase, string> = {
  beta: 'Beta en curso',
  fundadores: 'Programa Fundadores',
  comercial: 'Comercial',
};

/** Proyección de ingreso mensual al completar el Batch Fundador. */
export function getFounderBatchProjectionClp(
  slotLimit: number = FOUNDER_SLOT_LIMIT,
  priceClp: number = FOUNDER_PRICE_CLP,
): number {
  return slotLimit * priceClp;
}
