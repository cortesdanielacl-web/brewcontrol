import React, { useEffect, useState } from 'react';
import type { AccountPlan, AdminBreweryListItem, Currency, Recipe } from '../../types';
import { getBreweryRecipes, updateBreweryAccount } from '../../services/adminService';
import {
  calculateRecipeFinancials,
  formatNumberOnly,
  formatRecipeDateDisplay,
} from '../../utils/formatters';
import { RecipeTechnicalSheetView } from '../recipe-wizard/RecipeTechnicalSheetView';
import { ArrowLeft, Beer, Eye, Loader2 } from 'lucide-react';

interface AdminCerveceriaDetailViewProps {
  brewery: AdminBreweryListItem;
  currency?: Currency;
  onBack: () => void;
  onBreweryUpdated: (brewery: AdminBreweryListItem) => void;
}

const PLAN_OPTIONS: { value: AccountPlan; label: string }[] = [
  { value: 'beta', label: 'Beta' },
  { value: 'fundador', label: 'Fundador' },
  { value: 'pro', label: 'Pro' },
];

const PLAN_LABELS: Record<AccountPlan, string> = {
  beta: 'Beta',
  fundador: 'Fundador',
  pro: 'Pro',
};

function getCostPerLiter(recipe: Recipe): number {
  const dbCost = recipe.costoLitro;
  if (dbCost != null && Number.isFinite(dbCost) && dbCost > 0) {
    return dbCost;
  }
  return calculateRecipeFinancials(recipe).costPerLiter;
}

export const AdminCerveceriaDetailView: React.FC<AdminCerveceriaDetailViewProps> = ({
  brewery,
  currency: currencyProp,
  onBack,
  onBreweryUpdated,
}) => {
  const currency: Currency = currencyProp ?? 'CLP';
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);
    setSelectedRecipe(null);

    getBreweryRecipes(brewery.id)
      .then(({ recipes: rows, error: fetchError }) => {
        if (!mounted) return;

        if (fetchError) {
          console.error('Error al cargar recetas de la cervecería:', fetchError);
          setError(fetchError.message || 'No se pudieron cargar las recetas.');
          setRecipes([]);
          return;
        }

        setRecipes(rows);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        console.error('Error al cargar recetas de la cervecería:', err);
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las recetas.');
        setRecipes([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [brewery.id]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const handleUpdateAccount = async (input: { active?: boolean; plan?: AccountPlan }) => {
    if (saving) return;

    setSaving(true);
    try {
      const { brewery: updated, error: updateError } = await updateBreweryAccount(brewery.id, input);

      if (updateError || !updated) {
        showToast('error', updateError?.message || 'No se pudo actualizar la cuenta.');
        return;
      }

      onBreweryUpdated(updated);

      if (input.active !== undefined) {
        showToast(
          'success',
          updated.active ? 'Cuenta activada correctamente.' : 'Cuenta desactivada correctamente.',
        );
      } else if (input.plan !== undefined) {
        showToast('success', `Plan actualizado a ${PLAN_LABELS[updated.plan]}.`);
      }
    } catch (err: unknown) {
      console.error('Error al actualizar la cuenta:', err);
      showToast('error', err instanceof Error ? err.message : 'No se pudo actualizar la cuenta.');
    } finally {
      setSaving(false);
    }
  };

  if (selectedRecipe) {
    return (
      <RecipeTechnicalSheetView
        recipe={selectedRecipe}
        currency={currency}
        onExportExcel={() => undefined}
        onBackToList={() => setSelectedRecipe(null)}
      />
    );
  }

  const infoItems: { label: string; value: React.ReactNode }[] = [
    { label: 'Cervecería', value: brewery.breweryName || '—' },
    { label: 'Contacto', value: brewery.masterBrewer || '—' },
    { label: 'Correo', value: brewery.email || '—' },
    {
      label: 'Rol',
      value: (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
            brewery.role === 'admin'
              ? 'bg-[#0D1B2A] text-[#FBB040] border-slate-700'
              : 'bg-[#F8FAFC] text-[#0D1B2A] border-[#E9EEF5]'
          }`}
        >
          {brewery.role}
        </span>
      ),
    },
    {
      label: 'Estado',
      value: (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            brewery.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {brewery.active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      label: 'Plan',
      value: (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-100">
          {PLAN_LABELS[brewery.plan]}
        </span>
      ),
    },
    { label: 'Registro', value: formatRecipeDateDisplay(brewery.createdAt) },
    {
      label: 'Total recetas',
      value: loading ? '…' : String(recipes.length || brewery.recipeCount),
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 select-none pb-16 relative">
      {toast && (
        <div
          className={`fixed top-20 right-8 text-white px-5 py-3 rounded-2xl bc-shadow flex items-center gap-3 z-50 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          <p className="text-xs font-bold">{toast.message}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#0D1B2A] transition-colors cursor-pointer w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al listado
      </button>

      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">
          {brewery.breweryName || 'Sin nombre'}
        </h1>
        <p className="text-base text-[#475569] mt-1.5">
          Detalle de cervecería · Programa Fundadores (Beta)
        </p>
      </div>

      <div className="bg-white bc-card rounded-3xl p-6 md:p-8">
        <h2 className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-5">
          Información de la cuenta
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {infoItems.map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-bold text-[#475569] uppercase tracking-wider">{item.label}</dt>
              <dd className="mt-1.5 text-sm font-semibold text-[#0D1B2A] break-all">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="bg-white bc-card rounded-3xl p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
            Administración de la cuenta
          </h2>
          <p className="text-sm text-[#475569] mt-1.5">
            Gestiona el estado y el plan de esta cervecería en el Programa Fundadores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#E9EEF5] bg-[#F8FAFC] p-5 flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Estado actual</p>
              <p className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    brewery.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {brewery.active ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleUpdateAccount({ active: !brewery.active })}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                brewery.active
                  ? 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
                  : 'bg-[#0D1B2A] text-white hover:bg-[#122033]'
              }`}
            >
              {saving ? 'Guardando...' : brewery.active ? 'Desactivar cuenta' : 'Activar cuenta'}
            </button>
          </div>

          <div className="rounded-2xl border border-[#E9EEF5] bg-[#F8FAFC] p-5 flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">Plan actual</p>
              <p className="mt-2 text-sm font-semibold text-[#0D1B2A]">{PLAN_LABELS[brewery.plan]}</p>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Cambiar plan</span>
              <select
                value={brewery.plan}
                disabled={saving}
                onChange={(e) => {
                  const nextPlan = e.target.value as AccountPlan;
                  if (nextPlan === brewery.plan) return;
                  void handleUpdateAccount({ plan: nextPlan });
                }}
                className="w-full bc-input bg-white text-sm text-[#0D1B2A] font-medium py-2.5 px-3 focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {PLAN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white bc-card rounded-3xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 bg-[#F8FAFC] border-b bc-divider">
          <h2 className="text-sm font-bold text-[#0D1B2A]">Recetas de la cervecería</h2>
          <p className="text-xs text-[#475569] mt-1">
            Listado completo de recetas creadas por esta cuenta.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b bc-divider">
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Nombre
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Estilo
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Volumen
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Costo / L
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Creación
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-right">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EEF5] text-sm text-[#0D1B2A]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader2 className="w-8 h-8 text-slate-300 mx-auto mb-3 animate-spin" />
                    <p className="text-sm font-medium text-slate-500">Cargando recetas...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Beer className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-600 mb-1">No se pudieron cargar las recetas</p>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">{error}</p>
                  </td>
                </tr>
              ) : recipes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Beer className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-600">Esta cervecería aún no tiene recetas.</p>
                  </td>
                </tr>
              ) : (
                recipes.map((recipe) => {
                  const costPerLiter = getCostPerLiter(recipe);
                  return (
                    <tr key={recipe.id} className="hover:bg-bc-action/10/30 transition-colors group">
                      <td className="py-4 px-6 font-bold text-base text-[#0D1B2A]">{recipe.name}</td>
                      <td className="py-4 px-6">
                        <span
                          translate="no"
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-[#F8FAFC] text-[#0D1B2A] border-[#E9EEF5]"
                        >
                          {recipe.style || '—'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm font-semibold text-slate-600">
                        {recipe.volumeL} L
                      </td>
                      <td className="py-4 px-6 font-mono text-sm font-bold text-[#0D1B2A]">
                        {formatNumberOnly(costPerLiter, currency)}
                        <span className="ml-1 text-[10px] font-semibold text-slate-400 uppercase">
                          {currency}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">
                        {formatRecipeDateDisplay(recipe.lastModified)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedRecipe(recipe)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0D1B2A] hover:text-[#F5A623] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Ver receta"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver receta
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t bc-divider bg-[#F8FAFC]">
          <span className="text-xs font-semibold text-slate-500">
            {loading ? 'Cargando...' : `${recipes.length} receta${recipes.length === 1 ? '' : 's'}`}
          </span>
        </div>
      </div>
    </div>
  );
};
