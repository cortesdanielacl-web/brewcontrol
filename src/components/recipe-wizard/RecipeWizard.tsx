import React, { useState } from 'react';
import { Recipe, Currency, SaveRecipeResult, RecipeUpdater } from '../../types';
import { useRecipeWizardFinish } from '../../contexts/RecipeWizardFinishContext';
import { RecipeWizardStep } from '../../constants/recipeWizardSteps';
import { RecipeWizardStepIndicator } from './RecipeWizardStepIndicator';
import { RecipeStage1Elaboracion } from './RecipeStage1Elaboracion';
import { RecipeStage2CosteoProduccion } from './RecipeStage2CosteoProduccion';
import { RecipeStage3EvaluacionComercial } from './RecipeStage3EvaluacionComercial';
import { RecipeStage4Rentabilidad } from './RecipeStage4Rentabilidad';

interface RecipeWizardProps {
  recipe: Recipe;
  onUpdateRecipe: (update: RecipeUpdater) => void;
  /** Persiste currentCostingRecipe en App; no recibe snapshot del wizard. */
  onSaveRecipe: () => Promise<SaveRecipeResult>;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
}

export const RecipeWizard: React.FC<RecipeWizardProps> = ({
  recipe,
  onUpdateRecipe,
  onSaveRecipe,
  currency,
}) => {
  const { onRecipeFinished } = useRecipeWizardFinish();
  const [currentStep, setCurrentStep] = useState<RecipeWizardStep>(1);
  const [savedToast, setSavedToast] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!recipe || !recipe.ingredients || !recipe.indirectCosts) {
    return (
      <div className="max-w-[1440px] mx-auto p-8 text-center py-24 bg-white bc-card rounded-3xl mt-8">
        <h2 className="text-xl font-bold text-[#0D1B2A]">Selecciona o crea una receta para comenzar el asistente.</h2>
      </div>
    );
  }

  const showSavedToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  const persistRecipe = async (): Promise<Recipe | null> => {
    setSaveError(null);
    setSaving(true);

    try {
      // App lee currentCostingRecipe (única fuente de verdad), no el prop de este render.
      const { error, recipe: persistedRecipe } = await onSaveRecipe();
      if (error || !persistedRecipe) {
        setSaveError(error ?? 'No se pudo guardar la receta. Intenta nuevamente.');
        setTimeout(() => setSaveError(null), 5000);
        return null;
      }
      return persistedRecipe;
    } finally {
      setSaving(false);
    }
  };

  const handleStage1SaveAndContinue = async () => {
    const savedRecipe = await persistRecipe();
    if (!savedRecipe) return;
    showSavedToast();
    setCurrentStep(2);
  };

  const handleStage2SaveAndContinue = async () => {
    const savedRecipe = await persistRecipe();
    if (!savedRecipe) return;
    showSavedToast();
    setCurrentStep(3);
  };

  const handleStage2Back = () => {
    setCurrentStep(1);
  };

  const handleStage3SaveAndContinue = async () => {
    const savedRecipe = await persistRecipe();
    if (!savedRecipe) return;
    showSavedToast();
    setCurrentStep(4);
  };

  const handleStage3Back = () => {
    setCurrentStep(2);
  };

  const handleStage4Finish = async () => {
    const savedRecipe = await persistRecipe();
    if (!savedRecipe) return;
    showSavedToast();
    onRecipeFinished?.(savedRecipe);
  };

  const handleStage4Back = () => {
    setCurrentStep(3);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RecipeStage1Elaboracion
            recipe={recipe}
            onUpdateRecipe={onUpdateRecipe}
            onSaveAndContinue={handleStage1SaveAndContinue}
            savedToast={savedToast}
            saving={saving}
          />
        );
      case 2:
        return (
          <RecipeStage2CosteoProduccion
            recipe={recipe}
            currency={currency}
            onUpdateRecipe={onUpdateRecipe}
            onBack={handleStage2Back}
            onSaveAndContinue={handleStage2SaveAndContinue}
            savedToast={savedToast}
            saving={saving}
          />
        );
      case 3:
        return (
          <RecipeStage3EvaluacionComercial
            recipe={recipe}
            currency={currency}
            onUpdateRecipe={onUpdateRecipe}
            onBack={handleStage3Back}
            onSaveAndContinue={handleStage3SaveAndContinue}
            savedToast={savedToast}
            saving={saving}
          />
        );
      case 4:
        return (
          <RecipeStage4Rentabilidad
            recipe={recipe}
            currency={currency}
            onUpdateRecipe={onUpdateRecipe}
            onBack={handleStage4Back}
            onFinish={handleStage4Finish}
            savedToast={savedToast}
            saving={saving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[960px] mx-auto p-4 md:p-8 flex flex-col gap-6 animate-in fade-in duration-200 pb-16 select-none">
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">Nueva Receta</h1>
        <p className="text-base text-[#475569] mt-1.5">
          Asistente guiado para definir la fórmula técnica y evaluar su viabilidad comercial.
        </p>
      </div>

      {saveError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <span>⚠️</span> {saveError}
        </div>
      )}

      <RecipeWizardStepIndicator currentStep={currentStep} />

      {renderCurrentStep()}
    </div>
  );
};
