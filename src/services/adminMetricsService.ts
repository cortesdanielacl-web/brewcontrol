import type { PostgrestError } from '@supabase/supabase-js';
import {
  CURRENT_LAUNCH_PHASE,
  FOUNDER_PRICE_CLP,
  FOUNDER_SLOT_LIMIT,
  getFounderBatchProjectionClp,
  LAUNCH_PHASE_LABELS,
  type LaunchPhase,
} from '../constants/launchProgram';
import { supabase } from '../lib/supabase';
import type { AccountPlan, AdminBreweryListItem } from '../types';

/** Precio mensual por plan (CLP). Extensible cuando se defina Pro/Comercial. */
export const PLAN_MONTHLY_PRICE_CLP: Record<AccountPlan, number> = {
  beta: 0,
  fundador: FOUNDER_PRICE_CLP,
  pro: 0,
};

export interface ExecutiveMetrics {
  launch: {
    phase: LaunchPhase;
    label: string;
    /** Reserva para avance de Beta (0–100). null = aún no configurado. */
    betaProgressPercent: number | null;
  };
  founders: {
    occupiedSlots: number;
    slotLimit: number;
    availableSlots: number;
    progressPercent: number;
  };
  business: {
    monthlyRevenueClp: number;
    founderBatchProjectionClp: number;
    activeBreweries: number;
    inactiveBreweries: number;
  };
  activity: {
    totalBreweries: number;
    totalRecipes: number;
    latestBreweryName: string | null;
    latestBreweryAt: string | null;
    latestRecipeName: string | null;
    latestRecipeAt: string | null;
  };
}

interface ExecutiveMetricsRow {
  total_breweries: number | string;
  active_breweries: number | string;
  inactive_breweries: number | string;
  founder_breweries: number | string;
  beta_breweries: number | string;
  pro_breweries: number | string;
  active_fundador_count: number | string;
  active_pro_count: number | string;
  total_recipes: number | string;
  latest_brewery_name: string | null;
  latest_brewery_at: string | null;
  latest_recipe_name: string | null;
  latest_recipe_at: string | null;
}

function n(value: number | string | null | undefined): number {
  return Number(value) || 0;
}

function buildMetrics(row: ExecutiveMetricsRow): ExecutiveMetrics {
  const occupiedSlots = n(row.founder_breweries);
  const slotLimit = FOUNDER_SLOT_LIMIT;
  const availableSlots = Math.max(0, slotLimit - occupiedSlots);
  const progressPercent =
    slotLimit > 0 ? Math.min(100, Math.round((occupiedSlots / slotLimit) * 100)) : 0;

  const monthlyRevenueClp =
    n(row.active_fundador_count) * PLAN_MONTHLY_PRICE_CLP.fundador +
    n(row.active_pro_count) * PLAN_MONTHLY_PRICE_CLP.pro;

  return {
    launch: {
      phase: CURRENT_LAUNCH_PHASE,
      label: LAUNCH_PHASE_LABELS[CURRENT_LAUNCH_PHASE],
      betaProgressPercent: null,
    },
    founders: {
      occupiedSlots,
      slotLimit,
      availableSlots,
      progressPercent,
    },
    business: {
      monthlyRevenueClp,
      founderBatchProjectionClp: getFounderBatchProjectionClp(),
      activeBreweries: n(row.active_breweries),
      inactiveBreweries: n(row.inactive_breweries),
    },
    activity: {
      totalBreweries: n(row.total_breweries),
      totalRecipes: n(row.total_recipes),
      latestBreweryName: row.latest_brewery_name,
      latestBreweryAt: row.latest_brewery_at,
      latestRecipeName: row.latest_recipe_name,
      latestRecipeAt: row.latest_recipe_at,
    },
  };
}

/**
 * Calcula indicadores ejecutivos a partir de un listado de cervecerías ya cargado.
 * No consulta la base. Útil si el caller ya tiene `listBreweries()` en memoria.
 * Nota: no incluye nombre de la última receta (requiere RPC agregada).
 */
export function computeExecutiveMetricsFromBreweries(
  breweries: AdminBreweryListItem[],
  extras?: {
    totalRecipes?: number;
    latestRecipeName?: string | null;
    latestRecipeAt?: string | null;
  },
): ExecutiveMetrics {
  const customers = breweries.filter((b) => b.role !== 'admin');

  const activeFundador = customers.filter((b) => b.active && b.plan === 'fundador').length;
  const activePro = customers.filter((b) => b.active && b.plan === 'pro').length;
  const occupiedSlots = customers.filter((b) => b.plan === 'fundador').length;

  const sorted = [...customers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latest = sorted[0] ?? null;

  const totalRecipes =
    extras?.totalRecipes ?? customers.reduce((sum, b) => sum + (b.recipeCount || 0), 0);

  return buildMetrics({
    total_breweries: customers.length,
    active_breweries: customers.filter((b) => b.active).length,
    inactive_breweries: customers.filter((b) => !b.active).length,
    founder_breweries: occupiedSlots,
    beta_breweries: customers.filter((b) => b.plan === 'beta').length,
    pro_breweries: customers.filter((b) => b.plan === 'pro').length,
    active_fundador_count: activeFundador,
    active_pro_count: activePro,
    total_recipes: totalRecipes,
    latest_brewery_name: latest?.breweryName ?? null,
    latest_brewery_at: latest?.createdAt ?? null,
    latest_recipe_name: extras?.latestRecipeName ?? null,
    latest_recipe_at: extras?.latestRecipeAt ?? null,
  });
}

/**
 * Obtiene todos los indicadores del Dashboard Ejecutivo en una sola consulta RPC.
 * Requiere rol admin.
 */
export async function getExecutiveMetrics(): Promise<{
  metrics: ExecutiveMetrics | null;
  error: PostgrestError | Error | null;
}> {
  const { data, error } = await supabase.rpc('admin_get_executive_metrics');

  if (error) {
    return { metrics: null, error };
  }

  const rows = (data ?? []) as ExecutiveMetricsRow[];
  const row = rows[0];

  if (!row) {
    return {
      metrics: buildMetrics({
        total_breweries: 0,
        active_breweries: 0,
        inactive_breweries: 0,
        founder_breweries: 0,
        beta_breweries: 0,
        pro_breweries: 0,
        active_fundador_count: 0,
        active_pro_count: 0,
        total_recipes: 0,
        latest_brewery_name: null,
        latest_brewery_at: null,
        latest_recipe_name: null,
        latest_recipe_at: null,
      }),
      error: null,
    };
  }

  return { metrics: buildMetrics(row), error: null };
}
