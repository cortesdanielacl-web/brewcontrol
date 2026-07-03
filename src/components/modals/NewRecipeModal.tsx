import React from 'react';
import { Recipe } from '../../types';
import { DEFAULT_BLANK_RECIPE } from '../../data/mockData';
import { X, BookOpen, ArrowRight } from 'lucide-react';

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
  if (!isOpen) return null;

  const handleStartWizard = () => {
    const newRec: Recipe = {
      ...DEFAULT_BLANK_RECIPE,
      id: `recipe-${Date.now()}`,
      code: `REC-${Math.floor(Math.random() * 89 + 10)}`,
      name: '',
      style: '',
      volumeL: 1000,
      abv: 5.0,
      ibu: 25,
      status: 'BORRADOR',
      lastModified: 'Recién creada',
      ingredients: [],
      indirectCosts: {
        ...DEFAULT_BLANK_RECIPE.indirectCosts,
        custom: [],
      },
    };

    onCreateRecipe(newRec);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 select-none">
      <div className="bg-white bc-card rounded-3xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="bg-[#0D1B2A] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#F5A623] text-[#0D1B2A] p-2 rounded-xl">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Nueva Receta</h2>
              <p className="text-xs text-[rgba(255,255,255,0.55)]">Asistente guiado en 4 etapas</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-2xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-[#0D1B2A]">
          <p className="text-sm text-[#475569] leading-relaxed">
            Comenzarás con la <strong className="font-bold text-[#0D1B2A]">Elaboración de la Receta</strong>:
            información básica, parámetros técnicos e ingredientes. Los costos y la rentabilidad se definirán en las
            etapas siguientes.
          </p>

          <div className="bc-input p-4 text-xs text-[#475569] space-y-1">
            <p className="font-bold text-[#0D1B2A] uppercase tracking-wider">Paso 1 de 4</p>
            <p>🍺 Elaboración de la Receta</p>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t bc-divider">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleStartWizard}
              className="bg-[#0D1B2A] text-white hover:bg-[#122033] active:scale-95 transition-all px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 bc-shadow cursor-pointer"
            >
              <span>Comenzar asistente</span>
              <ArrowRight className="w-4 h-4 text-[#F5A623]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
