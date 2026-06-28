import React from 'react';
import { Sprout, PlusCircle, Trash2 } from 'lucide-react';
import { Recipe, Currency, IngredientCategory, IngredientItem } from '../../types';
import { PREDEFINED_INGREDIENTS } from '../../data/mockData';
import { formatNumberOnly } from '../../utils/formatters';

interface IngredientsSectionProps {
  recipe: Recipe;
  activeTab: IngredientCategory;
  onTabChange: (cat: IngredientCategory) => void;
  currentTabIngredients: IngredientItem[];
  currentTabSubtotal: number;
  currency: Currency;
  onIngredientChange: (id: string, field: keyof IngredientItem, value: any) => void;
  onIngredientDelete: (id: string) => void;
  onAddIngredient: () => void;
}

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  recipe,
  activeTab,
  onTabChange,
  currentTabIngredients,
  currentTabSubtotal,
  currency,
  onIngredientChange,
  onIngredientDelete,
  onAddIngredient,
}) => {
  const categories: IngredientCategory[] = ['maltas', 'lupulos', 'levaduras', 'adjuntos'];
  const options = PREDEFINED_INGREDIENTS[activeTab] || [];

  return (
    <section className="bg-white rounded-xl border border-[#c4c6cc]/70 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <Sprout className="w-5 h-5 text-[#795900]" />
          <h2 className="text-lg font-bold text-[#031d34]">2. Ingredientes</h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">Precios en CLP / kg</span>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          const count = recipe.ingredients.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => onTabChange(cat)}
              className={`px-4 py-2.5 font-bold text-xs capitalize transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
                isActive
                  ? 'border-[#795900] text-[#031d34] bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-[#031d34]'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-[#ffc641] text-[#715300]' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ingredients Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eef4ff] border-y border-[#c4c6cc]/60">
              <th className="py-2.5 px-3 text-xs font-bold text-[#44474c] uppercase w-5/12">Ingrediente</th>
              <th className="py-2.5 px-3 text-xs font-bold text-[#44474c] uppercase w-2/12 text-right">Cant. (Kg)</th>
              <th className="py-2.5 px-3 text-xs font-bold text-[#44474c] uppercase w-2/12 text-right">Precio/Kg</th>
              <th className="py-2.5 px-3 text-xs font-bold text-[#44474c] uppercase w-2/12 text-right">Subtotal</th>
              <th className="py-2.5 px-1 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTabIngredients.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-slate-400 font-medium bg-slate-50/50">
                  No hay {activeTab} añadidas en esta receta. Haz clic abajo para añadir.
                </td>
              </tr>
            ) : (
              currentTabIngredients.map((item) => {
                const subtotal = item.quantityKg * item.pricePerKg;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-2.5 px-3">
                      {activeTab !== 'adjuntos' ? (
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => onIngredientChange(item.id, 'name', e.target.value)}
                          placeholder={
                            activeTab === 'maltas'
                              ? 'Ej: Malta Pilsen, Munich...'
                              : activeTab === 'lupulos'
                              ? 'Ej: Lúpulo Citra, Mosaic...'
                              : 'Ej: Levadura US-05, S-04, WLP001...'
                          }
                          className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 rounded-none px-1 py-1 text-sm text-[#031d34] font-medium focus:border-[#795900] focus:ring-0 outline-none"
                        />
                      ) : (
                        <select
                          value={item.name}
                          onChange={(e) => {
                            const matched = options.find((o) => o.name === e.target.value);
                            if (matched) {
                              onIngredientChange(item.id, 'name', matched.name);
                              onIngredientChange(item.id, 'pricePerKg', matched.pricePerKg);
                            } else {
                              onIngredientChange(item.id, 'name', e.target.value);
                            }
                          }}
                          className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 rounded-none px-1 py-1 text-sm text-[#031d34] font-medium focus:border-[#795900] focus:ring-0 outline-none cursor-pointer"
                        >
                          {!options.some((o) => o.name === item.name) && (
                            <option value={item.name}>{item.name}</option>
                          )}
                          {options.map((opt) => (
                            <option key={opt.name} value={opt.name}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        step="0.01"
                        value={item.quantityKg || ''}
                        onChange={(e) => onIngredientChange(item.id, 'quantityKg', e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 rounded-none px-1 py-1 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#795900] focus:ring-0 outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        value={item.pricePerKg || ''}
                        onChange={(e) => onIngredientChange(item.id, 'pricePerKg', e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 rounded-none px-1 py-1 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#795900] focus:ring-0 outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-sm font-bold text-[#031d34] text-right">
                      {formatNumberOnly(subtotal, currency)}
                    </td>
                    <td className="py-2.5 px-1 text-center">
                      <button
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

      {/* Subtotal & Add Button */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
        <button
          onClick={onAddIngredient}
          className="flex items-center gap-1.5 text-[#795900] font-bold text-xs hover:text-[#ffc641] bg-amber-50 hover:bg-[#0f1c2c] transition-all px-3.5 py-2 rounded-lg cursor-pointer shadow-2xs"
        >
          <PlusCircle className="w-4 h-4" />
          Añadir {activeTab.slice(0, -1)}
        </button>
        <div className="font-mono text-sm font-bold text-[#031d34] bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
          Subtotal {activeTab}: <span className="text-[#795900]">{formatNumberOnly(currentTabSubtotal, currency)}</span>
        </div>
      </div>
    </section>
  );
};
