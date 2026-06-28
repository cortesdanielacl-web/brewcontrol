import { Currency, Recipe } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

export function formatCurrency(amountCLP: number, currency: Currency): string {
  const conf = CURRENCY_RATES[currency];
  const val = amountCLP * conf.rate;
  
  if (currency === 'CLP') {
    return `$${Math.round(val).toLocaleString('es-CL')} CLP`;
  } else if (currency === 'USD') {
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  } else {
    return `${val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  }
}

export function formatNumberOnly(amountCLP: number, currency: Currency): string {
  const conf = CURRENCY_RATES[currency];
  const val = amountCLP * conf.rate;
  if (currency === 'CLP') {
    return `$${Math.round(val).toLocaleString('es-CL')}`;
  }
  return conf.symbol + val.toLocaleString(currency === 'USD' ? 'en-US' : 'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function calculateRecipeFinancials(recipe?: Recipe | null) {
  if (!recipe || !recipe.ingredients || !recipe.indirectCosts) {
    return {
      ingredientsCost: 0,
      indirectCost: 0,
      totalCost: 0,
      costPerLiter: 0,
      costPerBottle: 0,
      suggestedPricePerBottle: 0,
      suggestedPricePerLiter: 0,
      projectedProfit: 0,
      ingredientsPercent: 0,
      indirectPercent: 0,
    };
  }

  // 1. Ingredients Cost
  const ingredientsCost = recipe.ingredients.reduce((acc, item) => {
    return acc + item.quantityKg * item.pricePerKg;
  }, 0);

  // 2. Indirect Costs
  const ind = recipe.indirectCosts;
  const standardIndirect = ind.agua + ind.gas + ind.arriendo + ind.botella + ind.tapas + ind.etiquetas + ind.luz + ind.transporte + ind.co2 + ind.manoDeObra;
  const customIndirect = ind.custom.reduce((acc, c) => acc + c.amount, 0);
  const indirectCost = standardIndirect + customIndirect;

  // 3. Total Cost
  const totalCost = ingredientsCost + indirectCost;

  // 4. Cost per Liter
  const vol = Math.max(recipe.volumeL, 1);
  const costPerLiter = totalCost / vol;

  // 5. Cost per Bottle
  const bottleSizeL = (recipe.bottleSizeMl || 330) / 1000;
  const costPerBottle = costPerLiter * bottleSizeL;

  // 6. Margin & Suggested Price
  // Margin formula: Selling Price = Cost / (1 - marginRatio)
  // Or if margin ratio is 60%: suggestedPrice = cost / (1 - 0.6)
  const marginRatio = Math.min(Math.max(recipe.desiredMargin, 0), 99) / 100;
  const suggestedPricePerBottle = marginRatio < 1 ? costPerBottle / (1 - marginRatio) : costPerBottle * 2;
  const suggestedPricePerLiter = marginRatio < 1 ? costPerLiter / (1 - marginRatio) : costPerLiter * 2;

  // Total Projected Profit for the whole batch
  const totalRevenue = suggestedPricePerLiter * vol;
  const projectedProfit = totalRevenue - totalCost;

  // Category distribution
  const ingredientsPercent = totalCost > 0 ? Math.round((ingredientsCost / totalCost) * 100) : 70;
  const indirectPercent = totalCost > 0 ? 100 - ingredientsPercent : 30;

  return {
    ingredientsCost,
    indirectCost,
    totalCost,
    costPerLiter,
    costPerBottle,
    suggestedPricePerBottle,
    suggestedPricePerLiter,
    projectedProfit,
    ingredientsPercent,
    indirectPercent,
  };
}
