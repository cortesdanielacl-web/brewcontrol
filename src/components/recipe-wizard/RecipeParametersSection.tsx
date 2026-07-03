import React from 'react';
import { Sliders } from 'lucide-react';
import { Recipe } from '../../types';

interface RecipeParametersSectionProps {
  recipe: Recipe;
  onChange: (field: keyof Recipe, value: number) => void;
}

export const RecipeParametersSection: React.FC<RecipeParametersSectionProps> = ({ recipe, onChange }) => {
  return (
    <section className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        <Sliders className="w-5 h-5 text-[#F5A623]" />
        <h2 className="text-lg font-bold text-[#0D1B2A]">Parámetros</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">ABV (%)</label>
          <input
            type="number"
            step="0.1"
            value={recipe.abv || ''}
            onChange={(e) => onChange('abv', Number(e.target.value))}
            className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">IBU</label>
          <input
            type="number"
            value={recipe.ibu || ''}
            onChange={(e) => onChange('ibu', Number(e.target.value))}
            className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action outline-none"
          />
        </div>
      </div>
    </section>
  );
};
