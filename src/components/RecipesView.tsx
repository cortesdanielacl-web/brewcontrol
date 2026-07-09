import React, { useState } from 'react';
import { Recipe, Currency } from '../types';
import { formatNumberOnly, calculateRecipeFinancials, formatLastModifiedDisplay } from '../utils/formatters';
import { Search, Filter, Plus, Edit, Copy, Trash2, Beer } from 'lucide-react';
import { COMING_SOON_TOOLTIP, comingSoonToolbarButtonClassName } from '../constants/ux';

interface RecipesViewProps {
  recipes: Recipe[];
  currency: Currency;
  onNewRecipeClick: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDuplicateRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  recipes,
  currency,
  onNewRecipeClick,
  onEditRecipe,
  onDuplicateRecipe,
  onDeleteRecipe,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = recipes.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecipeCostPerLiter = (recipe: Recipe): number => {
    const dbCost = recipe.costoLitro;
    if (dbCost != null && Number.isFinite(dbCost) && dbCost > 0) {
      return dbCost;
    }
    return calculateRecipeFinancials(recipe).costPerLiter;
  };

  const totalRecipesCount = recipes.length;
  const avgCostPerLiter =
    recipes.length > 0
      ? Math.round(recipes.reduce((acc, r) => acc + getRecipeCostPerLiter(r), 0) / recipes.length)
      : 0;

  const dominantStyleLabel = (() => {
    if (recipes.length === 0) return '—';

    const styleCounts: Record<string, number> = {};
    for (const recipe of recipes) {
      styleCounts[recipe.style] = (styleCounts[recipe.style] ?? 0) + 1;
    }

    let style = '';
    let count = 0;
    for (const [styleName, styleCount] of Object.entries(styleCounts)) {
      if (styleCount > count) {
        style = styleName;
        count = styleCount;
      }
    }

    return `${style} (${count})`;
  })();

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 select-none pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">Mis Recetas</h1>
          <p className="text-base text-[#475569] mt-1.5">Gestiona y evalúa tu catálogo de productos cervecero.</p>
        </div>

        <button
          onClick={onNewRecipeClick}
          className="bg-[#0D1B2A] text-white hover:bg-[#122033] active:scale-95 transition-all px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bc-shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nueva Receta
        </button>
      </div>

      {/* Bento Stats Row (matching exact screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Recetas */}
        <div className="bg-white bc-card rounded-3xl p-6 flex flex-col justify-between h-36">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Total Recetas</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-black text-[#0D1B2A] leading-none">{totalRecipesCount}</span>
            {totalRecipesCount > 0 && (
              <span className="text-xs font-semibold text-slate-400">en tu catálogo</span>
            )}
          </div>
        </div>

        {/* Costo Promedio */}
        <div className="bg-white bc-card rounded-3xl p-6 flex flex-col justify-between h-36">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Costo Promedio / L</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl md:text-5xl font-black text-[#0D1B2A] leading-none font-mono">
              {formatNumberOnly(avgCostPerLiter, currency)}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase">{currency}</span>
          </div>
        </div>

        {/* Estilo Dominante */}
        <div className="bg-white bc-card rounded-3xl p-6 flex flex-col justify-between h-36">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Estilo Dominante</span>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="p-2 bg-amber-50 rounded-xl text-[#F5A623]">
              <Beer className="w-6 h-6" />
            </div>
            <span className="text-2xl md:text-3xl font-black text-[#0D1B2A] tracking-tight" translate="no">
              {dominantStyleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white bc-card rounded-3xl overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between p-5 pb-6 bg-[#F8FAFC]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o estilo..."
              className="w-full pl-10 pr-4 py-2.5 bc-input bg-white text-sm text-[#0D1B2A] font-medium focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
            />
          </div>

          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TOOLTIP}
            className={`hidden sm:flex ${comingSoonToolbarButtonClassName}`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros avanzados</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b bc-divider">
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">Nombre</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">Estilo</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">Litros</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">Costo Total</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">Fecha Modificación</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EEF5] text-sm text-[#0D1B2A]">
              {recipes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Beer className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-600 mb-4">No tienes recetas guardadas.</p>
                    <button
                      onClick={onNewRecipeClick}
                      className="bg-[#0D1B2A] text-white hover:bg-[#122033] active:scale-95 transition-all px-5 py-2.5 rounded-2xl font-bold text-xs inline-flex items-center gap-1.5 bc-shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Crear primera receta
                    </button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No hay recetas que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filtered.map((recipe) => {
                  const fin = calculateRecipeFinancials(recipe);

                  return (
                    <tr key={recipe.id} className="hover:bg-bc-action/10/30 transition-colors group">
                      <td className="py-4 px-6 font-bold text-base text-[#0D1B2A]">
                        <div className="flex items-center gap-2">
                          <span>{recipe.name}</span>
                          {recipe.status === 'BORRADOR' && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">Borrador</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          translate="no"
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          recipe.style.includes('Stout')
                            ? 'bg-[#0D1B2A] text-[#FBB040] border-slate-700'
                            : recipe.style.includes('Pilsner')
                            ? 'bg-[#FBB040] text-[#122033] border-[#F5A623]'
                            : 'bg-[#F8FAFC] text-[#0D1B2A] border-[rgba(255,255,255,0.55)]'
                        }`}
                        >
                          {recipe.style}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm font-semibold text-slate-600">
                        {recipe.volumeL} L
                      </td>
                      <td className="py-4 px-6 font-mono text-sm font-bold text-[#0D1B2A]">
                        {formatNumberOnly(fin.totalCost, currency)}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">
                        {formatLastModifiedDisplay(recipe.lastModified)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditRecipe(recipe)}
                            className="p-2 text-slate-600 hover:text-[#F5A623] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Evaluar / Editar Receta"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDuplicateRecipe(recipe)}
                            className="p-2 text-slate-600 hover:text-bc-action hover:bg-bc-action/10 rounded-lg transition-colors cursor-pointer"
                            title="Duplicar receta"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteRecipe(recipe.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar receta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t bc-divider bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Mostrando {filtered.length} de {recipes.length} recetas
          </span>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TOOLTIP}
            className="p-1.5 rounded text-slate-300 bg-white cursor-not-allowed"
          >
            <Filter className="w-4 h-4 rotate-90" aria-hidden />
            <span className="sr-only">Paginación — {COMING_SOON_TOOLTIP}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
