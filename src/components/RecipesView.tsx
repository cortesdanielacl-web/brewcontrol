import React, { useState } from 'react';
import { Recipe, Currency } from '../types';
import { formatNumberOnly, calculateRecipeFinancials } from '../utils/formatters';
import { Search, Filter, Plus, Edit, Copy, Trash2, Beer, Sparkles } from 'lucide-react';

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

    const styleCounts = recipes.reduce<Record<string, number>>((acc, recipe) => {
      acc[recipe.style] = (acc[recipe.style] || 0) + 1;
      return acc;
    }, {});

    const [style, count] = Object.entries(styleCounts).reduce<[string, number]>(
      (best, current) => (current[1] > best[1] ? (current as [string, number]) : best),
      ['', 0]
    );

    return `${style} (${count})`;
  })();

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 select-none pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#031d34]">Mis Recetas</h1>
          <p className="text-base text-[#44474c] mt-1.5">Gestiona y costea tu catálogo de productos cervecero.</p>
        </div>

        <button
          onClick={onNewRecipeClick}
          className="bg-[#0f1c2c] text-white hover:bg-[#1b324a] active:scale-95 transition-all px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nueva Receta
        </button>
      </div>

      {/* Bento Stats Row (matching exact screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Recetas */}
        <div className="bg-white border border-[#c4c6cc]/70 rounded-2xl p-6 flex flex-col justify-between h-36 shadow-2xs">
          <span className="text-xs font-bold text-[#44474c] uppercase tracking-wider">Total Recetas</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-black text-[#031d34] leading-none">{totalRecipesCount}</span>
            <span className="text-xs font-bold text-[#d4a017]">+2 este mes</span>
          </div>
        </div>

        {/* Costo Promedio */}
        <div className="bg-white border border-[#c4c6cc]/70 rounded-2xl p-6 flex flex-col justify-between h-36 shadow-2xs">
          <span className="text-xs font-bold text-[#44474c] uppercase tracking-wider">Costo Promedio / L</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl md:text-5xl font-black text-[#031d34] leading-none font-mono">
              {formatNumberOnly(avgCostPerLiter, currency)}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase">{currency}</span>
          </div>
        </div>

        {/* Estilo Dominante */}
        <div className="bg-white border border-[#c4c6cc]/70 rounded-2xl p-6 flex flex-col justify-between h-36 shadow-2xs">
          <span className="text-xs font-bold text-[#44474c] uppercase tracking-wider">Estilo Dominante</span>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="p-2 bg-amber-50 rounded-xl text-[#d4a017]">
              <Beer className="w-6 h-6" />
            </div>
            <span className="text-2xl md:text-3xl font-black text-[#031d34] tracking-tight">{dominantStyleLabel}</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#c4c6cc]/70 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#f8f9ff]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777d]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o estilo..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c4c6cc] rounded-xl text-sm text-[#031d34] font-medium focus:border-[#795900] focus:ring-1 focus:ring-[#795900] outline-none shadow-2xs transition-all"
            />
          </div>

          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#031d34] bg-white border border-[#c4c6cc] hover:bg-slate-50 rounded-xl transition-colors shadow-2xs cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-[#0f1c2c]" />
            <span>Filtros avanzados</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#c4c6cc]/60">
                <th className="py-3.5 px-6 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap">Nombre</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap">Estilo</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap">Litros</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap">Costo Total</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap">Fecha Modificación</th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-[#031d34]">
              {recipes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Beer className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-600 mb-4">No tienes recetas guardadas.</p>
                    <button
                      onClick={onNewRecipeClick}
                      className="bg-[#0f1c2c] text-white hover:bg-[#1b324a] active:scale-95 transition-all px-5 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      + Crear primera receta
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
                  const isGoldStyle = recipe.style.includes('Pilsner') || recipe.style.includes('Stout');

                  return (
                    <tr key={recipe.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-4 px-6 font-bold text-base text-[#031d34]">
                        <div className="flex items-center gap-2">
                          <span>{recipe.name}</span>
                          {recipe.status === 'BORRADOR' && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">Borrador</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          recipe.style.includes('Stout')
                            ? 'bg-[#0f1c2c] text-[#ffdfa0] border-slate-700'
                            : recipe.style.includes('Pilsner')
                            ? 'bg-[#ffdfa0] text-[#5c4300] border-[#f6be39]'
                            : 'bg-[#dbe9ff] text-[#031d34] border-[#bac8dc]'
                        }`}>
                          {recipe.style}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm font-semibold text-slate-600">
                        {recipe.volumeL} L
                      </td>
                      <td className="py-4 px-6 font-mono text-sm font-bold text-[#031d34]">
                        {formatNumberOnly(fin.totalCost, currency)}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                        {recipe.lastModified}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditRecipe(recipe)}
                            className="p-2 text-slate-600 hover:text-[#d4a017] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Costear / Editar Receta"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDuplicateRecipe(recipe)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
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
        <div className="px-6 py-4 border-t border-slate-100 bg-[#f8f9ff] flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Mostrando {filtered.length} de {recipes.length} recetas en tu base local
          </span>
          <div className="flex gap-1.5">
            <button disabled className="p-1.5 rounded border border-slate-200 text-slate-300 bg-white"><Filter className="w-4 h-4 rotate-90" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
