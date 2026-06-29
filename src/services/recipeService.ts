import { supabase } from '../lib/supabase';
import { DEFAULT_BLANK_RECIPE } from '../data/mockData';
import { IndirectCosts, IngredientItem, Recipe } from '../types';

/**
 * Columnas reales de public.recipes (PostgreSQL / Supabase).
 * No coinciden 1:1 con el tipo Recipe de la app.
 */
interface RecipeRow {
  id: string;
  user_id?: string | null;
  nombre: string;
  estilo: string;
  litros: number;
  og: number;
  abv: number;
  ibu: number;
  created_at: string;
  costo_litro?: number | null;
  ingredients?: IngredientItem[] | null;
  indirect_costs?: IndirectCosts | null;
  desired_margin?: number | null;
  bottle_size_ml?: number | null;
}

/**
 * Mapeo Recipe (app) → recipes (BD):
 *
 * | Recipe            | recipes (BD)  | Notas                          |
 * |-------------------|---------------|--------------------------------|
 * | name              | nombre        |                                |
 * | style             | estilo        |                                |
 * | volumeL           | litros        |                                |
 * | og                | og            |                                |
 * | abv               | abv           |                                |
 * | ibu               | ibu           |                                |
 * | id                | id            | Generado por la BD (UUID)      |
 * | —                 | user_id       | UUID del usuario autenticado     |
 * | lastModified      | created_at    | Solo lectura al insertar       |
 * | code              | —             | Sin columna                    |
 * | status            | —             | Sin columna                    |
 * | bottleSizeMl      | bottle_size_ml|                                |
 * | desiredMargin     | desired_margin|                                |
 * | ingredients       | ingredients   | jsonb                          |
 * | indirectCosts     | indirect_costs| jsonb                          |
 * | logEvents         | —             | Sin columna                    |
 * | costoLitro        | costo_litro   |                                |
 */
function mapRecipeToRow(recipe: Recipe): Omit<RecipeRow, 'id' | 'created_at'> {
  return {
    nombre: recipe.name,
    estilo: recipe.style,
    litros: recipe.volumeL,
    og: recipe.og,
    abv: recipe.abv,
    ibu: recipe.ibu,
    ingredients: recipe.ingredients,
    indirect_costs: recipe.indirectCosts,
    desired_margin: recipe.desiredMargin,
    bottle_size_ml: recipe.bottleSizeMl,
  };
}

function mapRowToRecipe(row: RecipeRow, source: Recipe): Recipe {
  return {
    ...source,
    id: row.id,
    name: row.nombre,
    style: row.estilo,
    volumeL: row.litros,
    og: row.og,
    abv: row.abv,
    ibu: row.ibu,
    lastModified: row.created_at,
    costoLitro: row.costo_litro ?? null,
    ingredients: row.ingredients ?? DEFAULT_BLANK_RECIPE.ingredients,
    indirectCosts: row.indirect_costs ?? DEFAULT_BLANK_RECIPE.indirectCosts,
    desiredMargin: row.desired_margin ?? DEFAULT_BLANK_RECIPE.desiredMargin,
    bottleSizeMl: row.bottle_size_ml ?? DEFAULT_BLANK_RECIPE.bottleSizeMl,
  };
}

function mapRowToRecipeFromDb(row: RecipeRow): Recipe {
  return mapRowToRecipe(row, { ...DEFAULT_BLANK_RECIPE });
}

export async function getRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`No se pudieron obtener las recetas: ${error.message}`);
  }

  return (data as RecipeRow[]).map(mapRowToRecipeFromDb);
}

export async function createRecipe(recipe: Recipe): Promise<Recipe> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('No hay un usuario autenticado para crear la receta.');
  }

  const row = {
    ...mapRecipeToRow(recipe),
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('recipes')
    .insert(row)
    .select()
    .single();

  if (error) {
    throw new Error(`No se pudo crear la receta: ${error.message}`);
  }

  return mapRowToRecipe(data as RecipeRow, recipe);
}

/** IDs generados por Supabase (UUID). Los borradores locales usan prefijos como recipe-, copy-, draft-. */
export function isPersistedRecipeId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function recipeExists(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('recipes')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    // IDs locales (draft-, copy-, etc.) no son int8 válidos → no existen en BD
    if (error.code === '22P02' || /invalid input syntax/i.test(error.message)) {
      return false;
    }
    throw new Error(`No se pudo comprobar si la receta existe: ${error.message}`);
  }

  return data !== null;
}

export async function updateRecipe(recipe: Recipe): Promise<Recipe> {
  const row = mapRecipeToRow(recipe);

  const { data, error } = await supabase
    .from('recipes')
    .update(row)
    .eq('id', recipe.id)
    .select()
    .single();

  if (error) {
    throw new Error(`No se pudo actualizar la receta: ${error.message}`);
  }

  return mapRowToRecipe(data as RecipeRow, recipe);
}

export async function deleteRecipe(id: string | number): Promise<void> {
  const dbId = typeof id === 'number' || /^\d+$/.test(String(id)) ? Number(id) : id;

  console.log('deleteRecipe dbId:', dbId);
  console.log('deleteRecipe typeof dbId:', typeof dbId);

  const { data, error } = await supabase.from('recipes').delete().eq('id', dbId).select('id');

  if (error) {
    throw new Error(`No se pudo eliminar la receta: ${error.message}`);
  }

  if (!data?.length) {
    throw new Error('No se pudo eliminar la receta: ninguna fila fue eliminada.');
  }
}
