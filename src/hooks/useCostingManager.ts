import { useState } from 'react';
import { Recipe, IngredientCategory, IngredientItem } from '../types';
import { PREDEFINED_INGREDIENTS } from '../data/mockData';
import { calculateRecipeFinancials } from '../utils/formatters';

export function useCostingManager(
  recipe: Recipe,
  onUpdateRecipe: (updated: Recipe) => void,
  onSaveRecipe: (recipe: Recipe) => void
) {
  const [activeTab, setActiveTab] = useState<IngredientCategory>('maltas');
  const [savedToast, setSavedToast] = useState(false);

  const financials = calculateRecipeFinancials(recipe);

  const handleGeneralChange = (field: keyof Recipe, value: any) => {
    onUpdateRecipe({ ...recipe, [field]: value, lastModified: 'Hace un momento' });
  };

  const handleIngredientChange = (id: string, field: keyof IngredientItem, value: any) => {
    const nextIngs = recipe.ingredients.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: Number(value) || value };
      }
      return item;
    });
    onUpdateRecipe({ ...recipe, ingredients: nextIngs, lastModified: 'Hace un momento' });
  };

  const handleIngredientDelete = (id: string) => {
    const nextIngs = recipe.ingredients.filter((item) => item.id !== id);
    onUpdateRecipe({ ...recipe, ingredients: nextIngs, lastModified: 'Hace un momento' });
  };

  const handleAddIngredient = () => {
    const predefined = PREDEFINED_INGREDIENTS[activeTab] || [];
    const firstOption = predefined[0] || { name: 'Nuevo Ingrediente', pricePerKg: 1000 };
    const newItem: IngredientItem = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: activeTab !== 'adjuntos' ? '' : firstOption.name,
      category: activeTab,
      quantityKg: activeTab === 'maltas' ? 25 : activeTab === 'lupulos' ? 1 : 0.5,
      pricePerKg: activeTab === 'maltas' ? 1200 : activeTab === 'lupulos' ? 28000 : activeTab === 'levaduras' ? 8000 : firstOption.pricePerKg,
    };
    onUpdateRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newItem],
      lastModified: 'Hace un momento',
    });
  };

  const handleIndirectChange = (field: keyof typeof recipe.indirectCosts, value: number) => {
    onUpdateRecipe({
      ...recipe,
      indirectCosts: {
        ...recipe.indirectCosts,
        [field]: Number(value) >= 0 ? Number(value) : 0,
      },
      lastModified: 'Hace un momento',
    });
  };

  const handleAddCustomExpense = () => {
    const nextCustom = [
      ...recipe.indirectCosts.custom,
      { id: `cust-${Date.now()}`, name: 'Nuevo Gasto', amount: 0 },
    ];
    onUpdateRecipe({
      ...recipe,
      indirectCosts: { ...recipe.indirectCosts, custom: nextCustom },
      lastModified: 'Hace un momento',
    });
  };

  const handleSave = () => {
    onSaveRecipe(recipe);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  const currentTabIngredients = recipe.ingredients.filter((i) => i.category === activeTab);
  const currentTabSubtotal = currentTabIngredients.reduce((acc, i) => acc + i.quantityKg * i.pricePerKg, 0);

  return {
    activeTab,
    setActiveTab,
    savedToast,
    financials,
    handleGeneralChange,
    handleIngredientChange,
    handleIngredientDelete,
    handleAddIngredient,
    handleIndirectChange,
    handleAddCustomExpense,
    handleSave,
    currentTabIngredients,
    currentTabSubtotal,
  };
}
