import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Recipe, Currency, RecipeUpdater } from '../../types';
import { ProductionCostField } from '../../utils/formatters';
import { RecipeReadOnlySummarySection } from './RecipeReadOnlySummarySection';
import { RecipeProductionCostsSection } from './RecipeProductionCostsSection';

interface RecipeStage2CosteoProduccionProps {
  recipe: Recipe;
  currency: Currency;
  onUpdateRecipe: (update: RecipeUpdater) => void;
  onBack: () => void;
  onSaveAndContinue: () => Promise<void>;
  savedToast: boolean;
  saving: boolean;
}

export const RecipeStage2CosteoProduccion: React.FC<RecipeStage2CosteoProduccionProps> = ({
  recipe,
  currency,
  onUpdateRecipe,
  onBack,
  onSaveAndContinue,
  savedToast,
  saving,
}) => {
  const handleProductionCostChange = (field: ProductionCostField, value: number) => {
    onUpdateRecipe((prev) => ({
      ...prev,
      indirectCosts: {
        ...prev.indirectCosts,
        [field]: Number(value) >= 0 ? Number(value) : 0,
      },
      lastModified: 'Hace un momento',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveAndContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedToast && (
        <div className="bg-[#0D1B2A] text-white px-5 py-3 rounded-2xl bc-shadow border border-[#F5A623] flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-[#F5A623] text-[#0D1B2A] p-1 rounded-full">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-bold">Costeo guardado</p>
            <p className="text-[11px] text-slate-300">Costos de producción registrados en tu receta</p>
          </div>
        </div>
      )}

      <RecipeReadOnlySummarySection recipe={recipe} />
      <RecipeProductionCostsSection
        recipe={recipe}
        currency={currency}
        onProductionCostChange={handleProductionCostChange}
      />

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
          className="bg-[#0D1B2A] text-white hover:bg-[#122033] active:scale-98 transition-all font-bold text-sm px-7 py-3 rounded-2xl bc-shadow flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{saving ? 'Guardando…' : 'Guardar y continuar'}</span>
          <ArrowRight className="w-4 h-4 text-[#F5A623]" />
        </button>
      </div>
    </form>
  );
};
