import React, { useState } from 'react';
import { Recipe } from '../../types';
import { X, Plus, BookOpen, ArrowRight } from 'lucide-react';

interface NewRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRecipe: (newRecipe: Recipe) => void;
}

export const NewRecipeModal: React.FC<NewRecipeModalProps> = ({
  isOpen,
  onClose,
  onCreateRecipe,
}) => {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('American IPA');
  const [volumeL, setVolumeL] = useState(1000);
  const [og, setOg] = useState(1.055);
  const [abv, setAbv] = useState(5.8);
  const [ibu, setIbu] = useState(38);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRec: Recipe = {
      id: `recipe-${Date.now()}`,
      code: `REC-${Math.floor(Math.random() * 89 + 10)}`,
      name: name.trim(),
      style,
      volumeL: Number(volumeL) || 1000,
      og: Number(og) || 1.050,
      abv: Number(abv) || 5.0,
      ibu: Number(ibu) || 25,
      status: 'BORRADOR',
      lastModified: 'Recién creada',
      bottleSizeMl: 330,
      desiredMargin: 55,
      ingredients: [
        { id: `ing-${Date.now()}-1`, name: 'Malta Pale Ale (Weyermann)', category: 'maltas', quantityKg: Math.round((volumeL / 100) * 20), pricePerKg: 1200 },
        { id: `ing-${Date.now()}-2`, name: 'Lúpulo Citra (Pellets)', category: 'lupulos', quantityKg: Math.round((volumeL / 100) * 1), pricePerKg: 28000 },
        { id: `ing-${Date.now()}-3`, name: 'Levadura Ale (US-05 / S-04)', category: 'levaduras', quantityKg: Math.round((volumeL / 100) * 0.1 * 10) / 10, pricePerKg: 8000 },
      ],
      indirectCosts: {
        agua: Math.round(volumeL * 15),
        gas: Math.round(volumeL * 10),
        arriendo: Math.round(volumeL * 25),
        botella: Math.round(volumeL * 60),
        tapas: Math.round(volumeL * 8),
        etiquetas: Math.round(volumeL * 18),
        luz: Math.round(volumeL * 12),
        transporte: Math.round(volumeL * 15),
        co2: Math.round(volumeL * 8),
        manoDeObra: Math.round(volumeL * 45),
        custom: [],
      },
    };

    onCreateRecipe(newRec);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="bg-[#0f1c2c] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#ffc641] text-[#0f1c2c] p-2 rounded-xl">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Crear Nueva Receta Comercial</h2>
              <p className="text-xs text-[#bac8dc]">Añade una fórmula al catálogo para costeo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[#031d34]">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre de la Cerveza</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Golden Ale Patagonia"
              required
              className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#795900]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Estilo Cerveza</label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Ej: American IPA, Stout..."
                required
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#795900]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Volumen Estándar (Lts)</label>
              <input
                type="number"
                value={volumeL}
                onChange={(e) => setVolumeL(Number(e.target.value))}
                required
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">ABV (%)</label>
              <input
                type="number"
                step="0.1"
                value={abv}
                onChange={(e) => setAbv(Number(e.target.value))}
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-3 py-2 text-sm font-mono font-bold text-right"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">IBU</label>
              <input
                type="number"
                value={ibu}
                onChange={(e) => setIbu(Number(e.target.value))}
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-3 py-2 text-sm font-mono font-bold text-right"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#0f1c2c] text-white hover:bg-[#1b324a] active:scale-95 transition-all px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Crear y Costear</span>
              <ArrowRight className="w-4 h-4 text-[#ffc641]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
