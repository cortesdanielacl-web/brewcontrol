import React from 'react';
import { Settings2 } from 'lucide-react';
import { Recipe, Currency } from '../../types';
import {
  ProductionCostField,
  PRODUCTION_COST_FIELDS,
  calculateStage2Financials,
  formatCurrency,
} from '../../utils/formatters';

interface RecipeProductionCostsSectionProps {
  recipe: Recipe;
  currency: Currency;
  onProductionCostChange: (field: ProductionCostField, value: number) => void;
}

export const RecipeProductionCostsSection: React.FC<RecipeProductionCostsSectionProps> = ({
  recipe,
  currency,
  onProductionCostChange,
}) => {
  const { ingredientsCost, productionCostsTotal, totalBatchCost, costPerLiter } =
    calculateStage2Financials(recipe);

  return (
    <div className="space-y-6">
      {/* 1. Costos de ingredientes */}
      <section className="bg-[#F8FAFC]/60 bc-card rounded-3xl p-6">
        <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">Costos de ingredientes</p>
        <p className="text-xs text-slate-500 mb-3">Calculado automáticamente desde la Etapa 1</p>
        <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">Costo total de ingredientes</p>
        <p className="text-2xl font-mono font-black text-[#0D1B2A]">{formatCurrency(ingredientsCost, currency)}</p>
      </section>

      {/* 2. Costos de producción */}
      <section className="bg-white bc-card rounded-3xl p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-4">
          <Settings2 className="w-5 h-5 text-[#F5A623]" />
          <h2 className="text-lg font-bold text-[#0D1B2A]">Costos de Producción</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRODUCTION_COST_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">{label}</label>
              <input
                type="number"
                min={0}
                step={1}
                value={recipe.indirectCosts[key] || ''}
                onChange={(e) => onProductionCostChange(key, Number(e.target.value))}
                className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t bc-divider">
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">Costo total de producción</p>
          <p className="text-2xl font-mono font-black text-[#F5A623]">
            {formatCurrency(productionCostsTotal, currency)}
          </p>
        </div>
      </section>

      {/* 3. Resumen final de costos */}
      <section className="bg-[#0D1B2A] rounded-3xl border border-[#F5A623]/30 p-6 bc-shadow">
        <h2 className="text-sm font-bold text-[#F5A623] tracking-wide mb-5">💰 Resumen de costos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Costo total ingredientes</p>
            <p className="text-lg font-mono font-black text-white">{formatCurrency(ingredientsCost, currency)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Costo total producción</p>
            <p className="text-lg font-mono font-black text-white">{formatCurrency(productionCostsTotal, currency)}</p>
          </div>
        </div>

        <div className="border-t border-[#F5A623]/20 pt-5 space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Costo real del lote</p>
            <p className="text-xl font-mono font-black text-white">{formatCurrency(totalBatchCost, currency)}</p>
          </div>
          <div className="bg-[#0D1B2A]/60 rounded-3xl border border-[#F5A623]/40 p-5">
            <p className="text-xs font-bold text-[#F5A623] tracking-wider uppercase mb-2">Costo real de producción ($/L)</p>
            <p className="text-3xl sm:text-4xl font-mono font-black text-white leading-tight">
              {formatCurrency(costPerLiter, currency)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
