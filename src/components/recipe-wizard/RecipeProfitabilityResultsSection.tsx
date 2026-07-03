import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Recipe, Currency } from '../../types';
import { calculateStage4Financials, formatCurrency } from '../../utils/formatters';

interface RecipeProfitabilityResultsSectionProps {
  recipe: Recipe;
  currency: Currency;
}

export const RecipeProfitabilityResultsSection: React.FC<RecipeProfitabilityResultsSectionProps> = ({
  recipe,
  currency,
}) => {
  const {
    precioNeto,
    precioFinal,
    utilidadPorUnidad,
    utilidadTotal,
    margenReal,
    pricingMode,
  } = calculateStage4Financials(recipe);

  const isProfit = utilidadPorUnidad >= 0;

  return (
    <section className="bg-[#0D1B2A] rounded-3xl border border-[#F5A623]/30 p-6 bc-shadow">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        <TrendingUp className="w-5 h-5 text-[#F5A623]" />
        <h2 className="text-lg font-bold text-white">Resultados de rentabilidad</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Precio neto</p>
          <p className="text-xl font-mono font-black text-white">{formatCurrency(precioNeto, currency)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Por unidad, sin IVA</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Precio final</p>
          <p className="text-xl font-mono font-black text-[#F5A623]">{formatCurrency(precioFinal, currency)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {recipe.indirectCosts.applyIva ? 'Incluye IVA 19%' : 'Sin IVA aplicado'}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Utilidad por unidad</p>
          <p className={`text-xl font-mono font-black ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(utilidadPorUnidad, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Utilidad total del lote</p>
          <p className={`text-xl font-mono font-black ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(utilidadTotal, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Margen real</p>
          <p className="text-xl font-mono font-black text-white">{margenReal.toFixed(1)}%</p>
          {pricingMode === 'automatic' && (
            <p className="text-[11px] text-slate-500 mt-1">
              Meta: {recipe.desiredMargin}%
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
