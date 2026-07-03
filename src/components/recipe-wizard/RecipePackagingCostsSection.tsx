import React from 'react';
import { Box } from 'lucide-react';
import { Recipe, Currency } from '../../types';
import {
  BOTTLE_PACKAGING_COST_FIELDS,
  CAN_PACKAGING_COST_FIELDS,
  KEG_PACKAGING_COST_FIELDS,
  PackagingCostField,
  calculateStage3Financials,
  formatCurrency,
  formatPackagingUnits,
  getPackagingType,
  normalizePackagingFormatMl,
} from '../../utils/formatters';

interface RecipePackagingCostsSectionProps {
  recipe: Recipe;
  currency: Currency;
  onPackagingCostChange: (field: PackagingCostField, value: number) => void;
}

export const RecipePackagingCostsSection: React.FC<RecipePackagingCostsSectionProps> = ({
  recipe,
  currency,
  onPackagingCostChange,
}) => {
  const formatMl = normalizePackagingFormatMl(recipe.bottleSizeMl);
  const packagingType = getPackagingType(formatMl);
  const costFields =
    packagingType === 'keg'
      ? KEG_PACKAGING_COST_FIELDS
      : packagingType === 'bottle'
        ? BOTTLE_PACKAGING_COST_FIELDS
        : CAN_PACKAGING_COST_FIELDS;

  const {
    units,
    packagingCostPerUnit,
    totalPackagingCost,
    finalCostPerUnit,
  } = calculateStage3Financials(recipe);

  const unitLabel =
    packagingType === 'keg' ? 'barril' : packagingType === 'bottle' ? 'botella' : 'lata';

  return (
    <div className="space-y-6">
      <section className="bg-white bc-card rounded-3xl p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-4">
          <Box className="w-5 h-5 text-[#F5A623]" />
          <h2 className="text-lg font-bold text-[#0D1B2A]">Costos de envasado</h2>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Costo por {unitLabel}. Se multiplica por{' '}
          {formatPackagingUnits(units, packagingType)} {packagingType === 'keg' ? 'barriles' : 'unidades'}.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {costFields.map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">{label}</label>
              <input
                type="number"
                min={0}
                step={1}
                value={recipe.indirectCosts[key] || ''}
                onChange={(e) => onPackagingCostChange(key, Number(e.target.value))}
                className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0D1B2A] rounded-3xl border border-[#F5A623]/30 p-6 bc-shadow">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Costo total de envasado</p>
            <p className="text-xl font-mono font-black text-[#F5A623]">
              {formatCurrency(totalPackagingCost, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
              {packagingType === 'keg' ? 'Costo de envasado por barril' : 'Costo de envasado por unidad'}
            </p>
            <p className="text-xl font-mono font-black text-white">
              {formatCurrency(packagingCostPerUnit, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
              {packagingType === 'keg' ? 'Costo final por barril' : 'Costo final por unidad'}
            </p>
            <p className="text-xl font-mono font-black text-white">
              {formatCurrency(finalCostPerUnit, currency)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
