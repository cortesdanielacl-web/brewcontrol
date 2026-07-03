import React from 'react';
import { Percent } from 'lucide-react';
import { Recipe } from '../../types';

interface RecipeCommercialExpensesSectionProps {
  recipe: Recipe;
  onApplyIvaChange: (value: boolean) => void;
  onRedcompraCommissionChange: (value: number) => void;
  onOtherDiscountsChange: (value: number) => void;
}

export const RecipeCommercialExpensesSection: React.FC<RecipeCommercialExpensesSectionProps> = ({
  recipe,
  onApplyIvaChange,
  onRedcompraCommissionChange,
  onOtherDiscountsChange,
}) => {
  const ind = recipe.indirectCosts;

  return (
    <section className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        <Percent className="w-5 h-5 text-[#F5A623]" />
        <h2 className="text-lg font-bold text-[#0D1B2A]">Gastos comerciales</h2>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between bc-input rounded-2xl px-4 py-3">
          <div>
            <p className="text-sm font-bold text-[#0D1B2A]">Aplicar IVA</p>
            <p className="text-xs text-slate-500">Agrega 19% al precio final de venta</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={ind.applyIva ?? false}
            onClick={() => onApplyIvaChange(!(ind.applyIva ?? false))}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
              ind.applyIva ? 'bg-[#F5A623]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                ind.applyIva ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">
              Comisión venta Redcompra (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={ind.redcompraCommission ?? ''}
              onChange={(e) => onRedcompraCommissionChange(Number(e.target.value))}
              className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">
              Otros descuentos (opcional)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={ind.otherDiscounts ?? ''}
              onChange={(e) => onOtherDiscountsChange(Number(e.target.value))}
              placeholder="0"
              className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
            />
            <p className="text-[11px] text-slate-500">Porcentaje adicional sobre el precio neto</p>
          </div>
        </div>
      </div>
    </section>
  );
};
