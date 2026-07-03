import React from 'react';
import { RecipeWizardStep, getRecipeWizardStepConfig, RECIPE_WIZARD_TOTAL_STEPS } from '../../constants/recipeWizardSteps';

interface RecipeWizardStepIndicatorProps {
  currentStep: RecipeWizardStep;
}

export const RecipeWizardStepIndicator: React.FC<RecipeWizardStepIndicatorProps> = ({ currentStep }) => {
  const config = getRecipeWizardStepConfig(currentStep);

  return (
    <div className="bg-white bc-card rounded-3xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Paso {currentStep} de {RECIPE_WIZARD_TOTAL_STEPS}
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="text-sm font-bold text-[#0D1B2A] flex items-center gap-2">
            <span aria-hidden>{config.emoji}</span>
            <span>{config.title}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: RECIPE_WIZARD_TOTAL_STEPS }, (_, index) => {
            const stepNumber = (index + 1) as RecipeWizardStep;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                key={stepNumber}
                className={`h-2 rounded-full transition-all ${
                  isActive ? 'w-8 bg-[#F5A623]' : isCompleted ? 'w-4 bg-[#F5A623]' : 'w-4 bg-slate-200'
                }`}
                aria-hidden
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
