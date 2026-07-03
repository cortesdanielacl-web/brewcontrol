import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Recipe, Currency } from '../../types';
import { calculateStage4Financials, formatCurrency } from '../../utils/formatters';

interface RecipeStage4SummarySectionProps {
  recipe: Recipe;
  currency: Currency;
}

export const RecipeStage4SummarySection: React.FC<RecipeStage4SummarySectionProps> = ({
  recipe,
  currency,
}) => {
  const { formatLabel, units, finalCostPerUnit } = calculateStage4Financials(recipe);

  return (
    <section className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        <ClipboardList className="w-5 h-5 text-[#F5A623]" />
        <h2 className="text-lg font-bold text-[#0D1B2A]">Resumen de la receta</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Nombre</p>
          <p className="text-sm font-medium text-[#0D1B2A]">{recipe.name || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Formato de venta</p>
          <p className="text-sm font-medium text-[#0D1B2A]">{formatLabel}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Cantidad de unidades</p>
          <p className="text-sm font-mono font-bold text-[#0D1B2A]">{units.toLocaleString('es-CL')}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Costo final por unidad</p>
          <p className="text-sm font-mono font-bold text-[#0D1B2A]">
            {formatCurrency(finalCostPerUnit, currency)}
          </p>
          <p className="text-[11px] text-slate-500">Producción + envasado (Etapas 2 y 3)</p>
        </div>
      </div>
    </section>
  );
};
