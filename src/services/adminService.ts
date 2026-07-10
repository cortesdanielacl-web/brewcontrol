import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AccountPlan, AdminBreweryListItem, Recipe, UserRole } from '../types';
import { mapDbRecipeRow } from './recipeService';

interface AdminBreweryRow {
  id: string;
  brewery_name: string | null;
  master_brewer: string | null;
  email: string | null;
  role: string;
  active: boolean;
  plan: string | null;
  created_at: string;
  recipe_count: number | string;
}

function parseUserRole(role: string | null | undefined): UserRole {
  return role === 'admin' ? 'admin' : 'user';
}

function parseAccountPlan(plan: string | null | undefined): AccountPlan {
  if (plan === 'fundador' || plan === 'pro') return plan;
  return 'beta';
}

function mapBreweryRow(row: AdminBreweryRow): AdminBreweryListItem {
  return {
    id: row.id,
    breweryName: row.brewery_name,
    masterBrewer: row.master_brewer,
    email: row.email,
    role: parseUserRole(row.role),
    active: row.active,
    plan: parseAccountPlan(row.plan),
    createdAt: row.created_at,
    recipeCount: Number(row.recipe_count) || 0,
  };
}

/**
 * Lista todas las cervecerías con email, plan y cantidad de recetas.
 * Requiere rol admin (validado en la RPC SECURITY DEFINER).
 */
export async function listBreweries(): Promise<{
  breweries: AdminBreweryListItem[];
  error: PostgrestError | Error | null;
}> {
  const { data, error } = await supabase.rpc('admin_list_breweries');

  if (error) {
    return { breweries: [], error };
  }

  const rows = (data ?? []) as AdminBreweryRow[];
  return {
    breweries: rows.map(mapBreweryRow),
    error: null,
  };
}

/**
 * Recetas de una cervecería (por user_id / profiles.id).
 * Requiere rol admin (validado en la RPC SECURITY DEFINER).
 */
export async function getBreweryRecipes(userId: string): Promise<{
  recipes: Recipe[];
  error: PostgrestError | Error | null;
}> {
  const { data, error } = await supabase.rpc('admin_get_brewery_recipes', {
    p_user_id: userId,
  });

  if (error) {
    return { recipes: [], error };
  }

  const rows = data ?? [];
  return {
    recipes: (rows as unknown[]).map(mapDbRecipeRow),
    error: null,
  };
}

export interface UpdateBreweryAccountInput {
  active?: boolean;
  plan?: AccountPlan;
}

/**
 * Actualiza estado (active) y/o plan de una cervecería.
 * Requiere rol admin (validado en la RPC SECURITY DEFINER).
 */
export async function updateBreweryAccount(
  userId: string,
  input: UpdateBreweryAccountInput,
): Promise<{
  brewery: AdminBreweryListItem | null;
  error: PostgrestError | Error | null;
}> {
  if (input.active === undefined && input.plan === undefined) {
    return {
      brewery: null,
      error: new Error('Debe indicar al menos un campo a actualizar (active o plan).'),
    };
  }

  const { data, error } = await supabase.rpc('admin_update_brewery_account', {
    p_user_id: userId,
    p_active: input.active ?? null,
    p_plan: input.plan ?? null,
  });

  if (error) {
    return { brewery: null, error };
  }

  const rows = (data ?? []) as AdminBreweryRow[];
  const row = rows[0];
  if (!row) {
    return {
      brewery: null,
      error: new Error('No se recibió la cervecería actualizada.'),
    };
  }

  return {
    brewery: mapBreweryRow(row),
    error: null,
  };
}
