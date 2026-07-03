import React from 'react';
import { Calculator } from 'lucide-react';
import { Recipe, Currency, PricingMode } from '../../types';
import { calculateStage4Financials, formatCurrency } from '../../utils/formatters';

interface RecipePricingModeSectionProps {
  recipe: Recipe;
  currency: Currency;
  onPricingModeChange: (mode: PricingMode) => void;
  onDesiredMarginChange: (value: number) => void;
  onSalePriceChange: (value: number) => void;
}

export const RecipePricingModeSection: React.FC<RecipePricingModeSectionProps> = ({
  recipe,
  currency,
  onPricingModeChange,
  onDesiredMarginChange,
  onSalePriceChange,
}) => {
  const financials = calculateStage4Financials(recipe);
  const pricingMode = financials.pricingMode;

  return (
    <section className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        <Calculator className="w-5 h-5 text-[#F5A623]" />
        <h2 className="text-lg font-bold text-[#0D1B2A]">Modo de cálculo</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => onPricingModeChange('automatic')}
          className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
            pricingMode === 'automatic'
              ? 'bg-[#0D1B2A] text-white bc-shadow'
              : 'bg-[#F8FAFC] text-[#0D1B2A] hover:bg-white'
          }`}
        >
          Modo 1 — Automático
          <p className={`text-xs font-normal mt-1 ${pricingMode === 'automatic' ? 'text-slate-300' : 'text-slate-500'}`}>
            Ingresa el margen deseado y calculamos el precio sugerido
          </p>
        </button>
        <button
          type="button"
          onClick={() => onPricingModeChange('manual')}
          className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
            pricingMode === 'manual'
              ? 'bg-[#0D1B2A] text-white bc-shadow'
              : 'bg-[#F8FAFC] text-[#0D1B2A] hover:bg-white'
          }`}
        >
          Modo 2 — Manual
          <p className={`text-xs font-normal mt-1 ${pricingMode === 'manual' ? 'text-slate-300' : 'text-slate-500'}`}>
            Ingresa el precio de venta y calculamos el margen real
          </p>
        </button>
      </div>

      {pricingMode === 'automatic' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">
              Margen deseado (%)
            </label>
            <input
              type="number"
              min={0}
              max={99}
              step={0.1}
              value={recipe.desiredMargin ?? ''}
              onChange={(e) => onDesiredMarginChange(Number(e.target.value))}
              className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">
              Precio sugerido de venta
            </label>
            <div className="w-full bc-input rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right">
              {formatCurrency(financials.suggestedSalePrice, currency)}
            </div>
            <p className="text-[11px] text-slate-500">Precio neto calculado automáticamente</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">
              Precio de venta
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={recipe.indirectCosts.salePrice ?? ''}
              onChange={(e) => onSalePriceChange(Number(e.target.value))}
              className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
            />
            <p className="text-[11px] text-slate-500">Precio neto por unidad (sin IVA)</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">
              Margen real (%)
            </label>
            <div className="w-full bc-input rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right">
              {financials.margenReal.toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-500">Sobre ingreso neto después de comisiones</p>
          </div>
        </div>
      )}
    </section>
  );
};
