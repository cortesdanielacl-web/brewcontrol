import { createContext, useContext } from 'react';
import { Recipe } from '../types';

interface RecipeWizardFinishContextValue {
  onRecipeFinished?: (recipe: Recipe) => void;
}

export const RecipeWizardFinishContext = createContext<RecipeWizardFinishContextValue>({});

export function useRecipeWizardFinish() {
  return useContext(RecipeWizardFinishContext);
}
