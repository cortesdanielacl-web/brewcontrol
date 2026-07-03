import React, { useEffect, useState } from 'react';
import { Recipe, Currency } from '../types';
import { RecipeWizardFinishContext } from '../contexts/RecipeWizardFinishContext';
import { RecipeWizard } from './recipe-wizard/RecipeWizard';
import { RecipeTechnicalSheetView } from './recipe-wizard/RecipeTechnicalSheetView';

interface CostingViewProps {
  sessionKey: number;
  recipe: Recipe;
  onUpdateRecipe: (updated: Recipe) => void;
  onSaveRecipe: (recipe: Recipe) => Promise<string | null>;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onExportExcel: () => void;
  onBackToList: () => void;
  onNewRecipe: () => void;
}

export const CostingView: React.FC<CostingViewProps> = ({
  sessionKey,
  recipe,
  onUpdateRecipe,
  onSaveRecipe,
  currency,
  onCurrencyChange,
  onExportExcel,
  onBackToList,
  onNewRecipe,
}) => {
  const [viewMode, setViewMode] = useState<'wizard' | 'ficha'>('wizard');
  const [finishedRecipe, setFinishedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    setViewMode('wizard');
    setFinishedRecipe(null);
  }, [sessionKey]);

  useEffect(() => {
    if (viewMode === 'ficha') {
      setFinishedRecipe(recipe);
    }
  }, [recipe, viewMode]);

  const handleRecipeFinished = (savedRecipe: Recipe) => {
    setFinishedRecipe(savedRecipe);
    setViewMode('ficha');
  };

  const displayedRecipe = finishedRecipe ?? recipe;

  if (viewMode === 'ficha' && finishedRecipe) {
    return (
      <RecipeTechnicalSheetView
        recipe={displayedRecipe}
        currency={currency}
        onExportExcel={onExportExcel}
        onBackToList={onBackToList}
        onNewRecipe={onNewRecipe}
      />
    );
  }

  return (
    <RecipeWizardFinishContext.Provider value={{ onRecipeFinished: handleRecipeFinished }}>
      <RecipeWizard
        recipe={recipe}
        onUpdateRecipe={onUpdateRecipe}
        onSaveRecipe={onSaveRecipe}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
      />
    </RecipeWizardFinishContext.Provider>
  );
};
