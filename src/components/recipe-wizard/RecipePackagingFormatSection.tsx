import React from 'react';
import { Info, Package } from 'lucide-react';
import { Recipe, Currency, PackagingFormatMl } from '../../types';
import {
  BOTTLE_CAN_PACKAGING_FORMATS,
  KEG_PACKAGING_FORMATS,
  calculateFullKegBarrels,
  calculateKegRemainingLiters,
  calculatePackagingUnits,
  calculateStage3Financials,
  formatCurrency,
  formatPackagingUnits,
  getKegCapacityL,
  getPackagingType,
  normalizePackagingFormatMl,
} from '../../utils/formatters';
import { RecipeKegPackagingResultSection } from './RecipeKegPackagingResultSection';

interface RecipePackagingFormatSectionProps {
  recipe: Recipe;
  currency: Currency;
  onFormatChange: (formatMl: PackagingFormatMl) => void;
}

export const RecipePackagingFormatSection: React.FC<RecipePackagingFormatSectionProps> = ({
  recipe,
  currency,
  onFormatChange,
}) => {
  const selectedMl = normalizePackagingFormatMl(recipe.bottleSizeMl);
  const packagingType = getPackagingType(selectedMl);
  const isKeg = packagingType === 'keg';
  const capacityL = getKegCapacityL(selectedMl);
  const fullBarrels = calculateFullKegBarrels(recipe.volumeL, capacityL);
  const remainingLiters = calculateKegRemainingLiters(recipe.volumeL, capacityL);
  const units = isKeg
    ? fullBarrels
    : calculatePackagingUnits(recipe.volumeL, selectedMl);
  const { costPerLiter, productionCostPerUnit } = calculateStage3Financials(recipe);

  return (
    <section className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        <Package className="w-5 h-5 text-[#F5A623]" />
        <h2 className="text-lg font-bold text-[#0D1B2A]">Formato de envasado</h2>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BOTTLE_CAN_PACKAGING_FORMATS.map(({ ml, label }) => {
            const isSelected = !isKeg && selectedMl === ml;

            return (
              <button
                key={ml}
                type="button"
                onClick={() => onFormatChange(ml)}
                className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#0D1B2A] text-white bc-shadow'
                    : 'bg-[#F8FAFC] text-[#0D1B2A] hover:bg-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div>
          <button
            type="button"
            onClick={() => onFormatChange(isKeg ? selectedMl : 20000)}
            className={`w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              isKeg
                ? 'bg-[#0D1B2A] text-white bc-shadow'
                : 'bg-[#F8FAFC] text-[#0D1B2A] hover:bg-white'
            }`}
          >
            🍺 Barril
          </button>
        </div>

        {isKeg && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Capacidad del barril</p>
            <div className="grid grid-cols-3 gap-3">
              {KEG_PACKAGING_FORMATS.map(({ ml }) => {
                const kegCapacityL = getKegCapacityL(ml);
                const isCapacitySelected = selectedMl === ml;

                return (
                  <button
                    key={ml}
                    type="button"
                    onClick={() => onFormatChange(ml)}
                    className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                      isCapacitySelected
                        ? 'bg-[#F5A623] text-white bc-shadow'
                        : 'bg-[#F8FAFC] text-[#0D1B2A] hover:bg-white'
                    }`}
                  >
                    {kegCapacityL} litros
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isKeg ? (
          <RecipeKegPackagingResultSection
            volumeL={recipe.volumeL}
            capacityL={capacityL}
            fullBarrels={fullBarrels}
            remainingLiters={remainingLiters}
          />
        ) : (
          <div className="bg-[#F8FAFC]/60 rounded-3xl border border-[rgba(15,27,42,0.06)] p-4">
            <>
              <p className="text-xs font-bold text-[#475569] tracking-wider uppercase mb-1">
                Cantidad de unidades
              </p>
              <p className="text-2xl font-mono font-black text-[#0D1B2A]">
                {formatPackagingUnits(units, packagingType)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {recipe.volumeL.toLocaleString('es-CL')} L × 1000 ÷ {selectedMl} cc
              </p>
            </>
          </div>
        )}

        {isKeg && (
          <>
            <div className="bc-input p-4 flex gap-3">
              <Info className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-[#0D1B2A]">🍺 Barriles reutilizables</p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Los barriles se consideran envases reutilizables. Por esta razón BrewControl no agrega costos de
                  envasado para este formato. El costo final corresponde únicamente al costo de producción calculado en
                  la Etapa 2.
                </p>
              </div>
            </div>

            <section className="bg-[#0D1B2A] rounded-3xl border border-[#F5A623]/30 p-6 bc-shadow">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                    Costo por litro
                  </p>
                  <p className="text-xl font-mono font-black text-[#F5A623]">
                    {formatCurrency(costPerLiter, currency)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                    Capacidad del barril
                  </p>
                  <p className="text-xl font-mono font-black text-white">
                    {capacityL.toLocaleString('es-CL')} litros
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                    Costo por barril
                  </p>
                  <p className="text-xl font-mono font-black text-white">
                    {formatCurrency(productionCostPerUnit, currency)}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
};
