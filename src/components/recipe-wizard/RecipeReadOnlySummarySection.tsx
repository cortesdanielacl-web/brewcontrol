import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Recipe, Currency } from '../../types';
import { calculateStage2Financials, formatCurrency } from '../../utils/formatters';

interface RecipeReadOnlySummarySectionProps {
  recipe: Recipe;
  currency?: Currency;
  showCostPerLiter?: boolean;
}

export const RecipeReadOnlySummarySection: React.FC<RecipeReadOnlySummarySectionProps> = ({
  recipe,
  currency,
  showCostPerLiter = false,
}) => {
  const costPerLiter = calculateStage2Financials(recipe).costPerLiter;

  return (
    <section className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        <ClipboardList className="w-5 h-5 text-[#F5A623]" />
        <h2 className="text-lg font-bold text-[#0D1B2A]">Resumen de la receta</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Nombre</p>
          <p className="text-sm font-medium text-[#0D1B2A]">{recipe.name || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Estilo</p>
          <p className="text-sm font-medium text-[#0D1B2A]" translate="no">{recipe.style || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Litros objetivo</p>
          <p className="text-sm font-mono font-bold text-[#0D1B2A]">{recipe.volumeL.toLocaleString('es-CL')} L</p>
        </div>
      </div>

      {showCostPerLiter && currency && (
        <div className="mt-5 bg-[#0D1B2A] rounded-3xl border border-[#F5A623]/40 p-5 bc-shadow">
          <p className="text-sm font-bold text-[#F5A623] tracking-wide mb-2">💰 Costo real de producción</p>
          <p className="text-3xl sm:text-4xl font-mono font-black text-white leading-tight">
            {formatCurrency(costPerLiter, currency)}
          </p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Base para calcular todos los formatos de venta.
          </p>
        </div>
      )}
    </section>
  );
};
