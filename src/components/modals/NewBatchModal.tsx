import React, { useState } from 'react';
import { Recipe } from '../../types';
import { X, Plus, FlaskConical, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onStartBatch: (newBatch: Recipe) => void;
}

const DEFAULT_BASE_RECIPE: Recipe = {
  id: 'base-libre',
  code: 'REC-BASE',
  name: 'Cerveza Artesanal Libre',
  style: 'Estilo Libre',
  volumeL: 100,
  og: 1.050,
  abv: 5.0,
  ibu: 20,
  status: 'ACTIVO',
  lastModified: 'Recién creado',
  bottleSizeMl: 330,
  desiredMargin: 30,
  ingredients: [],
  indirectCosts: {
    agua: 0, gas: 0, arriendo: 0, botella: 0, tapas: 0, etiquetas: 0, luz: 0, transporte: 0, co2: 0, manoDeObra: 0, custom: []
  }
};

export const NewBatchModal: React.FC<NewBatchModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onStartBatch,
}) => {
  const availableRecipes = recipes && recipes.length > 0 ? recipes : [DEFAULT_BASE_RECIPE];
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(availableRecipes[0].id || '');
  const [batchVolume, setBatchVolume] = useState<number>(500);
  const [batchCode, setBatchCode] = useState<string>(`LOTE-${Math.floor(Math.random() * 899 + 100)}`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceRecipe = availableRecipes.find((r) => r.id === selectedRecipeId) || availableRecipes[0];
    if (!sourceRecipe) return;

    const newBatch: Recipe = {
      ...sourceRecipe,
      id: `batch-${Date.now()}`,
      code: batchCode,
      volumeL: batchVolume,
      status: 'EN PROGRESO',
      lastModified: 'Hoy, Recién iniciado',
      logEvents: [
        { id: '1', title: 'Maceración inicial', subtitle: 'Hoy, Recién iniciado', icon: 'science', status: 'active' },
      ],
    };

    onStartBatch(newBatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="bg-[#0f1c2c] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#ffc641] text-[#0f1c2c] p-2 rounded-xl">
              <FlaskConical className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Iniciar Nuevo Lote Cervecería</h2>
              <p className="text-xs text-[#bac8dc]">Abre una bitácora de cocción en planta</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-[#031d34]">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Seleccionar Receta Base</label>
            <select
              value={selectedRecipeId}
              onChange={(e) => setSelectedRecipeId(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-3 text-sm font-bold text-[#031d34] outline-none focus:border-[#795900] cursor-pointer"
            >
              {availableRecipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.style} - {r.name} ({r.desiredMargin}% Margen meta)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Volumen a Cocinar (Lts)</label>
              <input
                type="number"
                value={batchVolume}
                onChange={(e) => setBatchVolume(Number(e.target.value))}
                required
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-[#031d34]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Código de Lote Interno</label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                required
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-[#031d34]"
              />
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-900 leading-normal">
              Al confirmar, se iniciará el cálculo real de tu cerveza en el dashboard.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#ffc641] text-[#715300] hover:bg-[#ffdfa0] active:scale-95 transition-all px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Cocinar Lote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
