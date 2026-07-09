import React from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Recipe, Currency, PricingMode, RecipeUpdater } from '../../types';
import { RecipeStage4SummarySection } from './RecipeStage4SummarySection';
import { RecipePricingModeSection } from './RecipePricingModeSection';
import { RecipeCommercialExpensesSection } from './RecipeCommercialExpensesSection';
import { RecipeProfitabilityResultsSection } from './RecipeProfitabilityResultsSection';

interface RecipeStage4RentabilidadProps {
  recipe: Recipe;
  currency: Currency;
  onUpdateRecipe: (update: RecipeUpdater) => void;
  onBack: () => void;
  onFinish: () => Promise<void>;
  savedToast: boolean;
  saving: boolean;
}

export const RecipeStage4Rentabilidad: React.FC<RecipeStage4RentabilidadProps> = ({
  recipe,
  currency,
  onUpdateRecipe,
  onBack,
  onFinish,
  savedToast,
  saving,
}) => {
  const updateIndirect = (patch: Partial<Recipe['indirectCosts']>) => {
    onUpdateRecipe((prev) => ({
      ...prev,
      indirectCosts: { ...prev.indirectCosts, ...patch },
      lastModified: 'Hace un momento',
    }));
  };

  const handlePricingModeChange = (mode: PricingMode) => {
    updateIndirect({ pricingMode: mode });
  };

  const handleDesiredMarginChange = (value: number) => {
    onUpdateRecipe((prev) => ({
      ...prev,
      desiredMargin: Number(value) >= 0 ? Number(value) : 0,
      lastModified: 'Hace un momento',
    }));
  };

  const handleSalePriceChange = (value: number) => {
    updateIndirect({ salePrice: Number(value) >= 0 ? Number(value) : 0 });
  };

  const handleApplyIvaChange = (value: boolean) => {
    updateIndirect({ applyIva: value });
  };

  const handleRedcompraCommissionChange = (value: number) => {
    updateIndirect({ redcompraCommission: Number(value) >= 0 ? Number(value) : 0 });
  };

  const handleOtherDiscountsChange = (value: number) => {
    updateIndirect({ otherDiscounts: Number(value) >= 0 ? Number(value) : 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedToast && (
        <div className="bg-[#0D1B2A] text-white px-5 py-3 rounded-2xl bc-shadow border border-[#F5A623] flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-[#F5A623] text-[#0D1B2A] p-1 rounded-full">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-bold">Receta finalizada</p>
            <p className="text-[11px] text-slate-300">Rentabilidad calculada y guardada en tu catálogo</p>
          </div>
        </div>
      )}

      <RecipeStage4SummarySection recipe={recipe} currency={currency} />
      <RecipePricingModeSection
        recipe={recipe}
        currency={currency}
        onPricingModeChange={handlePricingModeChange}
        onDesiredMarginChange={handleDesiredMarginChange}
        onSalePriceChange={handleSalePriceChange}
      />
      <RecipeCommercialExpensesSection
        recipe={recipe}
        onApplyIvaChange={handleApplyIvaChange}
        onRedcompraCommissionChange={handleRedcompraCommissionChange}
        onOtherDiscountsChange={handleOtherDiscountsChange}
      />
      <RecipeProfitabilityResultsSection recipe={recipe} currency={currency} />

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="text-[#0D1B2A] hover:bg-slate-100 active:scale-98 transition-all font-bold text-sm px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#F5A623] text-[#0D1B2A] hover:bg-[#FBB040] active:scale-98 transition-all font-bold text-sm px-7 py-3 rounded-2xl bc-shadow flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{saving ? 'Guardando…' : 'Finalizar receta'}</span>
        </button>
      </div>
    </form>
  );
};
