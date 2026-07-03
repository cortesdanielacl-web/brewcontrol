export type RecipeWizardStep = 1 | 2 | 3 | 4;

export interface RecipeWizardStepConfig {
  step: RecipeWizardStep;
  emoji: string;
  title: string;
}

export const RECIPE_WIZARD_STEPS: RecipeWizardStepConfig[] = [
  { step: 1, emoji: '🍺', title: 'Elaboración de la Receta' },
  { step: 2, emoji: '⚙️', title: 'Costeo de Producción' },
  { step: 3, emoji: '📦', title: 'Evaluación Comercial' },
  { step: 4, emoji: '💰', title: 'Rentabilidad' },
];

export const RECIPE_WIZARD_TOTAL_STEPS = RECIPE_WIZARD_STEPS.length;

export function getRecipeWizardStepConfig(step: RecipeWizardStep): RecipeWizardStepConfig {
  return RECIPE_WIZARD_STEPS.find((s) => s.step === step) ?? RECIPE_WIZARD_STEPS[0];
}
