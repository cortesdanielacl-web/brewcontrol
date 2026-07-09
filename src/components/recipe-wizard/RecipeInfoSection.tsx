import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Recipe } from '../../types';

interface RecipeInfoSectionProps {
  recipe: Recipe;
  onChange: (field: keyof Recipe, value: string | number) => void;
}

export const RecipeInfoSection: React.FC<RecipeInfoSectionProps> = ({ recipe, onChange }) => {
  return (
    <section className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        <ClipboardList className="w-5 h-5 text-[#F5A623]" />
        <h2 className="text-lg font-bold text-[#0D1B2A]">Información</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5 md:col-span-1">
          <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">Nombre de la receta</label>
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Ej: Golden Ale Patagonia"
            className="w-full bc-input px-3.5 py-2.5 text-sm text-[#0D1B2A] font-medium focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">Estilo</label>
          <input
            type="text"
            value={recipe.style}
            onChange={(e) => onChange('style', e.target.value)}
            placeholder="Ej: American IPA, Stout..."
            className="w-full bc-input px-3.5 py-2.5 text-sm text-[#0D1B2A] font-medium focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
            translate="no"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#475569] tracking-wider uppercase">Litros objetivo</label>
          <input
            type="number"
            value={recipe.volumeL || ''}
            onChange={(e) => onChange('volumeL', Number(e.target.value))}
            className="w-full bc-input px-3 py-2.5 text-sm font-mono font-bold text-[#0D1B2A] text-right focus:border-bc-action outline-none"
          />
        </div>
      </div>
    </section>
  );
};
