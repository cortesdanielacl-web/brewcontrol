import React from 'react';
import { Sprout, PlusCircle, Trash2 } from 'lucide-react';
import { Recipe, IngredientCategory, IngredientItem } from '../../types';
import { formatNumberOnly } from '../../utils/formatters';

interface RecipeIngredientsSectionProps {
  recipe: Recipe;
  activeTab: IngredientCategory;
  onTabChange: (cat: IngredientCategory) => void;
  currentTabIngredients: IngredientItem[];
  onIngredientChange: (id: string, field: keyof IngredientItem, value: string | number) => void;
  onIngredientDelete: (id: string) => void;
  onAddIngredient: () => void;
}

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  maltas: 'Maltas',
  lupulos: 'Lúpulos',
  levaduras: 'Levaduras',
  adjuntos: 'Adjuntos',
};

const CATEGORY_QUANTITY_LABELS: Record<IngredientCategory, string> = {
  maltas: 'Cantidad (kg)',
  lupulos: 'Cantidad (g)',
  levaduras: 'Cantidad (g)',
  adjuntos: 'Cantidad',
};

const CATEGORY_QUANTITY_PLACEHOLDERS: Partial<Record<IngredientCategory, string>> = {
  maltas: 'Ej: 5,2',
  lupulos: 'Ej: 120',
  levaduras: 'Ej: 11',
};

const CATEGORY_PRICE_LABELS: Record<IngredientCategory, string> = {
  maltas: 'Precios en CLP/kg',
  lupulos: 'Precios en CLP/g',
  levaduras: 'Precios en CLP/sobre',
  adjuntos: 'Precios en CLP',
};

const INGREDIENT_NAME_PLACEHOLDERS: Record<IngredientCategory, string> = {
  maltas: 'Ej: Malta Pilsen, Munich...',
  lupulos: 'Ej: Lúpulo Citra, Mosaic...',
  levaduras: 'Ej: Levadura US-05, S-04...',
  adjuntos: 'Nombre del adjunto',
};

export const RecipeIngredientsSection: React.FC<RecipeIngredientsSectionProps> = ({
  recipe,
  activeTab,
  onTabChange,
  currentTabIngredients,
  onIngredientChange,
  onIngredientDelete,
  onAddIngredient,
}) => {
  const categories: IngredientCategory[] = ['maltas', 'lupulos', 'levaduras', 'adjuntos'];
  const currentTabSubtotal = currentTabIngredients.reduce(
    (acc, item) => acc + item.quantityKg * item.pricePerKg,
    0
  );

  return (
    <section className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5 pb-4">
        <div className="flex items-center gap-2.5">
          <Sprout className="w-5 h-5 text-[#F5A623]" />
          <h2 className="text-lg font-bold text-[#0D1B2A]">Ingredientes</h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">{CATEGORY_PRICE_LABELS[activeTab]}</span>
      </div>

      <div className="flex gap-2 mb-6 pb-1 overflow-x-auto">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          const count = recipe.ingredients.filter((i) => i.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onTabChange(cat)}
              className={`px-4 py-2.5 font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
                isActive
                  ? 'border-[#F5A623] text-[#0D1B2A] bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-[#0D1B2A]'
              }`}
            >
              <span>{CATEGORY_LABELS[cat]}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-[#F5A623] text-[#0D1B2A]' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-y bc-divider">
              <th className="py-2.5 px-3 text-xs font-bold text-[#475569] uppercase w-5/12">Ingrediente</th>
              <th className="py-2.5 px-3 text-xs font-bold text-[#475569] uppercase w-2/12 text-right">
                {CATEGORY_QUANTITY_LABELS[activeTab]}
              </th>
              <th className="py-2.5 px-3 text-xs font-bold text-[#475569] uppercase w-2/12 text-right">Precio</th>
              <th className="py-2.5 px-3 text-xs font-bold text-[#475569] uppercase w-2/12 text-right">Subtotal</th>
              <th className="py-2.5 px-1 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9EEF5]">
            {currentTabIngredients.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-slate-400 font-medium bg-slate-50/50">
                  No hay {CATEGORY_LABELS[activeTab].toLowerCase()} en esta receta. Haz clic abajo para añadir.
                </td>
              </tr>
            ) : (
              currentTabIngredients.map((item) => {
                const subtotal = item.quantityKg * item.pricePerKg;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => onIngredientChange(item.id, 'name', e.target.value)}
                        placeholder={INGREDIENT_NAME_PLACEHOLDERS[activeTab]}
                        className="w-full bg-transparent border-0 border-b border-dashed border-[#E9EEF5] rounded-none px-1 py-1 text-sm text-[#0D1B2A] font-medium focus:border-bc-action focus:ring-0 outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={item.quantityKg || ''}
                        onChange={(e) => onIngredientChange(item.id, 'quantityKg', e.target.value)}
                        placeholder={CATEGORY_QUANTITY_PLACEHOLDERS[activeTab]}
                        className="w-full bg-transparent border-0 border-b border-dashed border-[#E9EEF5] rounded-none px-1 py-1 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action focus:ring-0 outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        value={item.pricePerKg || ''}
                        onChange={(e) => onIngredientChange(item.id, 'pricePerKg', e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-dashed border-[#E9EEF5] rounded-none px-1 py-1 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action focus:ring-0 outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-sm font-bold text-[#0D1B2A] text-right">
                      {formatNumberOnly(subtotal, 'CLP')}
                    </td>
                    <td className="py-2.5 px-1 text-center">
                      <button
                        type="button"
                        onClick={() => onIngredientDelete(item.id)}
                        className="text-slate-300 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                        title="Eliminar ingrediente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 pt-4 border-t bc-divider flex justify-between items-center">
        <button
          type="button"
          onClick={onAddIngredient}
          className="flex items-center gap-1.5 text-[#F5A623] font-bold text-xs hover:text-[#F5A623] bg-amber-50 hover:bg-[#0D1B2A] transition-all px-3.5 py-2 rounded-2xl cursor-pointer bc-shadow"
        >
          <PlusCircle className="w-4 h-4" />
          Añadir {CATEGORY_LABELS[activeTab].slice(0, -1).toLowerCase() || CATEGORY_LABELS[activeTab].toLowerCase()}
        </button>
        <div className="font-mono text-sm font-bold text-[#0D1B2A] bg-slate-100 px-4 py-2 rounded-2xl">
          Subtotal {CATEGORY_LABELS[activeTab]}:{' '}
          <span className="text-[#F5A623]">{formatNumberOnly(currentTabSubtotal, 'CLP')}</span>
        </div>
      </div>
    </section>
  );
};
