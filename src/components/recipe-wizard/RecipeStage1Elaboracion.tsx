import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Recipe, IngredientCategory, IngredientItem } from '../../types';
import { PREDEFINED_INGREDIENTS } from '../../data/mockData';
import { RecipeInfoSection } from './RecipeInfoSection';
import { RecipeParametersSection } from './RecipeParametersSection';
import { RecipeIngredientsSection } from './RecipeIngredientsSection';

interface RecipeStage1ElaboracionProps {
  recipe: Recipe;
  onUpdateRecipe: (updated: Recipe) => void;
  onSaveAndContinue: () => Promise<void>;
  savedToast: boolean;
  saving: boolean;
}

export const RecipeStage1Elaboracion: React.FC<RecipeStage1ElaboracionProps> = ({
  recipe,
  onUpdateRecipe,
  onSaveAndContinue,
  savedToast,
  saving,
}) => {
  const [activeTab, setActiveTab] = useState<IngredientCategory>('maltas');

  const handleGeneralChange = (field: keyof Recipe, value: string | number) => {
    onUpdateRecipe({ ...recipe, [field]: value, lastModified: 'Hace un momento' });
  };

  const handleIngredientChange = (id: string, field: keyof IngredientItem, value: string | number) => {
    const nextIngs = recipe.ingredients.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: field === 'name' ? value : Number(value) || 0 };
      }
      return item;
    });
    onUpdateRecipe({ ...recipe, ingredients: nextIngs, lastModified: 'Hace un momento' });
  };

  const handleIngredientDelete = (id: string) => {
    onUpdateRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((item) => item.id !== id),
      lastModified: 'Hace un momento',
    });
  };

  const handleAddIngredient = () => {
    const predefined = PREDEFINED_INGREDIENTS[activeTab] || [];
    const firstOption = predefined[0] || { name: 'Nuevo ingrediente', pricePerKg: 0 };
    const newItem: IngredientItem = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: activeTab !== 'adjuntos' ? '' : firstOption.name,
      category: activeTab,
      quantityKg: activeTab === 'maltas' ? 25 : activeTab === 'lupulos' ? 1 : 0.5,
      pricePerKg: 0,
    };
    onUpdateRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newItem],
      lastModified: 'Hace un momento',
    });
  };

  const currentTabIngredients = recipe.ingredients.filter((i) => i.category === activeTab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe.name.trim()) return;
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
            <p className="text-xs font-bold">Receta guardada</p>
            <p className="text-[11px] text-slate-300">Elaboración técnica registrada en tu catálogo</p>
          </div>
        </div>
      )}

      <RecipeInfoSection recipe={recipe} onChange={handleGeneralChange} />
      <RecipeParametersSection recipe={recipe} onChange={handleGeneralChange} />
      <RecipeIngredientsSection
        recipe={recipe}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentTabIngredients={currentTabIngredients}
        onIngredientChange={handleIngredientChange}
        onIngredientDelete={handleIngredientDelete}
        onAddIngredient={handleAddIngredient}
      />

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!recipe.name.trim() || saving}
          className="bg-[#0D1B2A] text-white hover:bg-[#122033] active:scale-98 transition-all font-bold text-sm px-7 py-3 rounded-2xl bc-shadow flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{saving ? 'Guardando…' : 'Guardar y continuar'}</span>
          <ArrowRight className="w-4 h-4 text-[#F5A623]" />
        </button>
      </div>
    </form>
  );
};
