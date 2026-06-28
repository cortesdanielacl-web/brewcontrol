import React from 'react';
import { Sliders } from 'lucide-react';
import { Recipe } from '../../types';

interface GeneralParametersSectionProps {
  recipe: Recipe;
  onChange: (field: keyof Recipe, value: any) => void;
}

export const GeneralParametersSection: React.FC<GeneralParametersSectionProps> = ({
  recipe,
  onChange,
}) => {
  return (
    <section className="bg-white rounded-xl border border-[#c4c6cc]/70 p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3">
        <Sliders className="w-5 h-5 text-[#795900]" />
        <h2 className="text-lg font-bold text-[#031d34]">1. Parámetros Generales</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">
            Nombre de la Receta
          </label>
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Ej: IPA Atómica"
            className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3.5 py-2.5 text-sm text-[#031d34] font-medium focus:border-[#d4a017] focus:ring-1 focus:ring-[#d4a017] outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">
            Estilo
          </label>
          <input
            type="text"
            value={recipe.style}
            onChange={(e) => onChange('style', e.target.value)}
            placeholder="Ej: American IPA, Hazy IPA, Pilsner..."
            className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3.5 py-2.5 text-sm text-[#031d34] font-medium focus:border-[#d4a017] focus:ring-1 focus:ring-[#d4a017] outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-50">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">
            Volumen (Lts)
          </label>
          <input
            type="number"
            value={recipe.volumeL || ''}
            onChange={(e) => onChange('volumeL', Number(e.target.value))}
            className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#d4a017] outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">
            ABV Estimado (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={recipe.abv || ''}
            onChange={(e) => onChange('abv', Number(e.target.value))}
            className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#d4a017] outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#44474c] tracking-wider uppercase">
            IBU
          </label>
          <input
            type="number"
            value={recipe.ibu || ''}
            onChange={(e) => onChange('ibu', Number(e.target.value))}
            className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#031d34] text-right focus:border-[#d4a017] outline-none"
          />
        </div>
      </div>
    </section>
  );
};
