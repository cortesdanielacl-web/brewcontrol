import { Currency, Recipe, IndirectCosts, PackagingFormatMl, PackagingType, PricingMode } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

export interface PackagingFormatOption {
  ml: PackagingFormatMl;
  label: string;
  type: PackagingType;
}

export const BOTTLE_CAN_PACKAGING_FORMATS: PackagingFormatOption[] = [
  { ml: 330, label: 'Botella 330 cc', type: 'bottle' },
  { ml: 500, label: 'Botella 500 cc', type: 'bottle' },
  { ml: 473, label: 'Lata 473 cc', type: 'can' },
];

export const KEG_PACKAGING_FORMATS: PackagingFormatOption[] = [
  { ml: 20000, label: 'Barril 20 L', type: 'keg' },
  { ml: 30000, label: 'Barril 30 L', type: 'keg' },
  { ml: 50000, label: 'Barril 50 L', type: 'keg' },
];

export const PACKAGING_FORMATS: PackagingFormatOption[] = [
  ...BOTTLE_CAN_PACKAGING_FORMATS,
  ...KEG_PACKAGING_FORMATS,
];

export type BottlePackagingCostField = 'botella' | 'tapas' | 'etiquetas' | 'caja' | 'envasadoOtros';
export type CanPackagingCostField = 'lata' | 'etiquetas' | 'caja' | 'envasadoOtros';
export type KegPackagingCostField = 'barril' | 'acopleSankey' | 'etiquetas' | 'envasadoOtros';
export type PackagingCostField = BottlePackagingCostField | CanPackagingCostField | KegPackagingCostField;

export const BOTTLE_PACKAGING_COST_FIELDS: { key: BottlePackagingCostField; label: string }[] = [
  { key: 'botella', label: 'Botella' },
  { key: 'tapas', label: 'Tapa' },
  { key: 'etiquetas', label: 'Etiqueta' },
  { key: 'caja', label: 'Caja' },
  { key: 'envasadoOtros', label: 'Otros costos' },
];

export const CAN_PACKAGING_COST_FIELDS: { key: CanPackagingCostField; label: string }[] = [
  { key: 'lata', label: 'Lata' },
  { key: 'etiquetas', label: 'Etiqueta' },
  { key: 'caja', label: 'Caja' },
  { key: 'envasadoOtros', label: 'Otros costos' },
];

export const KEG_PACKAGING_COST_FIELDS: { key: KegPackagingCostField; label: string }[] = [
  { key: 'barril', label: 'Barril' },
  { key: 'acopleSankey', label: 'Acople/Tapa (Sankey)' },
  { key: 'etiquetas', label: 'Etiqueta' },
  { key: 'envasadoOtros', label: 'Otros costos' },
];

export function getPackagingType(formatMl: number): PackagingType {
  const format = PACKAGING_FORMATS.find((f) => f.ml === formatMl);
  return format?.type ?? 'bottle';
}

export function normalizePackagingFormatMl(formatMl: number): PackagingFormatMl {
  const match = PACKAGING_FORMATS.find((f) => f.ml === formatMl);
  return match?.ml ?? 330;
}

export function getKegCapacityL(formatMl: number): number {
  return formatMl / 1000;
}

export function calculatePackagingUnits(volumeL: number, formatMl: number): number {
  if (formatMl <= 0) return 0;
  return Math.floor((volumeL * 1000) / formatMl);
}

export function calculateFullKegBarrels(volumeL: number, capacityL: number): number {
  if (capacityL <= 0) return 0;
  return Math.floor(volumeL / capacityL);
}

export function calculateKegRemainingLiters(volumeL: number, capacityL: number): number {
  const fullBarrels = calculateFullKegBarrels(volumeL, capacityL);
  return volumeL - fullBarrels * capacityL;
}

export function calculateKegUnits(volumeL: number, capacityL: number): number {
  return calculateFullKegBarrels(volumeL, capacityL);
}

export function formatPackagingUnits(units: number, packagingType: PackagingType): string {
  if (packagingType === 'keg') {
    return Math.floor(units).toLocaleString('es-CL');
  }
  return units.toLocaleString('es-CL');
}

export function calculateStage3Financials(recipe: Recipe) {
  const { costPerLiter } = calculateStage2Financials(recipe);
  const formatMl = normalizePackagingFormatMl(recipe.bottleSizeMl);
  const packagingType = getPackagingType(formatMl);
  const ind = recipe.indirectCosts;

  if (packagingType === 'keg') {
    const capacityL = getKegCapacityL(formatMl);
    const units = calculateKegUnits(recipe.volumeL, capacityL);
    const productionCostPerUnit = costPerLiter * capacityL;
    const packagingCostPerUnit = KEG_PACKAGING_COST_FIELDS.reduce(
      (acc, { key }) => acc + (ind[key] ?? 0),
      0
    );
    const totalPackagingCost = packagingCostPerUnit * units;
    const finalCostPerUnit = productionCostPerUnit + packagingCostPerUnit;

    return {
      costPerLiter,
      formatMl,
      packagingType,
      units,
      packagingCostPerUnit,
      totalPackagingCost,
      productionCostPerUnit,
      finalCostPerUnit,
    };
  }

  const units = calculatePackagingUnits(recipe.volumeL, formatMl);
  const packagingCostFields =
    packagingType === 'bottle' ? BOTTLE_PACKAGING_COST_FIELDS : CAN_PACKAGING_COST_FIELDS;
  const packagingCostPerUnit = packagingCostFields.reduce(
    (acc, { key }) => acc + (ind[key] ?? 0),
    0
  );

  const totalPackagingCost = packagingCostPerUnit * units;
  const unitVolumeL = formatMl / 1000;
  const productionCostPerUnit = costPerLiter * unitVolumeL;
  const finalCostPerUnit = productionCostPerUnit + packagingCostPerUnit;

  return {
    costPerLiter,
    formatMl,
    packagingType,
    units,
    packagingCostPerUnit,
    totalPackagingCost,
    productionCostPerUnit,
    finalCostPerUnit,
  };
}

export const CHILE_IVA_RATE = 0.19;

export function getRecipePricingMode(recipe: Recipe): PricingMode {
  return recipe.indirectCosts.pricingMode ?? 'automatic';
}

export function calculateStage4Financials(recipe: Recipe) {
  const stage3 = calculateStage3Financials(recipe);
  const { finalCostPerUnit, units, formatMl } = stage3;
  const ind = recipe.indirectCosts;

  const pricingMode = getRecipePricingMode(recipe);
  const desiredMargin = Math.min(Math.max(recipe.desiredMargin ?? 0, 0), 99);
  const applyIva = ind.applyIva ?? false;
  const redcompraCommission = Math.min(Math.max(ind.redcompraCommission ?? 0, 0), 100);
  const otherDiscounts = Math.min(Math.max(ind.otherDiscounts ?? 0, 0), 100);
  const manualSalePrice = Math.max(ind.salePrice ?? 0, 0);

  const commissionRate = redcompraCommission / 100;
  const discountRate = otherDiscounts / 100;
  const deductionFactor = Math.max(1 - commissionRate - discountRate, 0.0001);

  const marginRatio = desiredMargin / 100;
  const netRevenueTarget =
    marginRatio < 1 ? finalCostPerUnit / (1 - marginRatio) : finalCostPerUnit * 2;

  const suggestedSalePrice = netRevenueTarget / deductionFactor;

  const precioNeto =
    pricingMode === 'automatic' ? suggestedSalePrice : manualSalePrice;

  const redcompraAmount = precioNeto * commissionRate;
  const otherDiscountAmount = precioNeto * discountRate;
  const netRevenue = precioNeto * deductionFactor;
  const precioFinal = applyIva ? precioNeto * (1 + CHILE_IVA_RATE) : precioNeto;
  const utilidadPorUnidad = netRevenue - finalCostPerUnit;
  const utilidadTotal = utilidadPorUnidad * units;
  const margenReal = netRevenue > 0 ? (utilidadPorUnidad / netRevenue) * 100 : 0;

  const formatLabel =
    PACKAGING_FORMATS.find((f) => f.ml === formatMl)?.label ?? `${formatMl} cc`;

  return {
    ...stage3,
    formatLabel,
    pricingMode,
    desiredMargin,
    applyIva,
    redcompraCommission,
    otherDiscounts,
    suggestedSalePrice,
    precioNeto,
    precioFinal,
    redcompraAmount,
    otherDiscountAmount,
    netRevenue,
    utilidadPorUnidad,
    utilidadTotal,
    margenReal,
  };
}

export type ProductionCostField = 'agua' | 'gas' | 'luz' | 'limpieza' | 'manoDeObra' | 'otros';

export const PRODUCTION_COST_FIELDS: { key: ProductionCostField; label: string }[] = [
  { key: 'agua', label: 'Agua' },
  { key: 'gas', label: 'Gas' },
  { key: 'luz', label: 'Electricidad' },
  { key: 'limpieza', label: 'Limpieza' },
  { key: 'manoDeObra', label: 'Mano de obra' },
  { key: 'otros', label: 'Otros costos' },
];

export function calculateIngredientsCost(recipe: Recipe): number {
  return recipe.ingredients.reduce((acc, item) => acc + item.quantityKg * item.pricePerKg, 0);
}

export function calculateProductionCostsTotal(indirectCosts: IndirectCosts): number {
  return PRODUCTION_COST_FIELDS.reduce((acc, { key }) => acc + (indirectCosts[key] ?? 0), 0);
}

export function calculateStage2Financials(recipe: Recipe) {
  const ingredientsCost = calculateIngredientsCost(recipe);
  const productionCostsTotal = calculateProductionCostsTotal(recipe.indirectCosts);
  const totalBatchCost = ingredientsCost + productionCostsTotal;
  const volumeL = Math.max(recipe.volumeL, 1);
  const costPerLiter = totalBatchCost / volumeL;

  return {
    ingredientsCost,
    productionCostsTotal,
    totalBatchCost,
    costPerLiter,
  };
}

/** Resultado unificado del motor oficial V1 (Stage 2 → 3 → 4). */
export interface BrewControlFinancials {
  ingredientsCost: number;
  productionCostsTotal: number;
  /** Ingredientes + costos de producción (Stage 2). */
  totalProductionCost: number;
  totalBatchCost: number;
  costPerLiter: number;
  formatMl: PackagingFormatMl;
  packagingType: PackagingType;
  formatLabel: string;
  units: number;
  packagingCostPerUnit: number;
  totalPackagingCost: number;
  productionCostPerUnit: number;
  /** Costo comercial por unidad: producción/unidad + envasado/unidad (Stage 3). */
  finalCostPerUnit: number;
  /** Costo comercial del lote: producción + envasado total. */
  totalCommercialCost: number;
  pricingMode: PricingMode;
  desiredMargin: number;
  applyIva: boolean;
  redcompraCommission: number;
  otherDiscounts: number;
  suggestedSalePrice: number;
  precioNeto: number;
  /** Valor principal V1: precio que cobra el cervecero al cliente. */
  precioFinal: number;
  redcompraAmount: number;
  otherDiscountAmount: number;
  netRevenue: number;
  utilidadPorUnidad: number;
  utilidadTotal: number;
  margenReal: number;
  ivaAmount: number;
  expectedTotalRevenue: number;
}

/**
 * Motor oficial BrewControl V1.
 * Compone Stage 2 → Stage 3 → Stage 4 sin duplicar fórmulas.
 * V1 excluye: arriendo, transporte, CO₂ y gastos personalizados.
 */
export function calculateBrewControlFinancials(recipe: Recipe): BrewControlFinancials {
  const stage2 = calculateStage2Financials(recipe);
  const stage3 = calculateStage3Financials(recipe);
  const stage4 = calculateStage4Financials(recipe);

  const totalCommercialCost = stage2.totalBatchCost + stage3.totalPackagingCost;
  const ivaAmount = stage4.applyIva ? stage4.precioNeto * CHILE_IVA_RATE : 0;
  const expectedTotalRevenue = stage4.precioFinal * stage4.units;

  return {
    ingredientsCost: stage2.ingredientsCost,
    productionCostsTotal: stage2.productionCostsTotal,
    totalProductionCost: stage2.totalBatchCost,
    totalBatchCost: stage2.totalBatchCost,
    costPerLiter: stage2.costPerLiter,
    formatMl: stage3.formatMl,
    packagingType: stage3.packagingType,
    formatLabel: stage4.formatLabel,
    units: stage3.units,
    packagingCostPerUnit: stage3.packagingCostPerUnit,
    totalPackagingCost: stage3.totalPackagingCost,
    productionCostPerUnit: stage3.productionCostPerUnit,
    finalCostPerUnit: stage3.finalCostPerUnit,
    totalCommercialCost,
    pricingMode: stage4.pricingMode,
    desiredMargin: stage4.desiredMargin,
    applyIva: stage4.applyIva,
    redcompraCommission: stage4.redcompraCommission,
    otherDiscounts: stage4.otherDiscounts,
    suggestedSalePrice: stage4.suggestedSalePrice,
    precioNeto: stage4.precioNeto,
    precioFinal: stage4.precioFinal,
    redcompraAmount: stage4.redcompraAmount,
    otherDiscountAmount: stage4.otherDiscountAmount,
    netRevenue: stage4.netRevenue,
    utilidadPorUnidad: stage4.utilidadPorUnidad,
    utilidadTotal: stage4.utilidadTotal,
    margenReal: stage4.margenReal,
    ivaAmount,
    expectedTotalRevenue,
  };
}

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

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTimeHHMM(date: Date): string {
  return date.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Presentación amigable de lastModified; no altera el valor almacenado. */
export function formatLastModifiedDisplay(value: string): string {
  if (!value) return '—';

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  const date = new Date(parsed);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const time = formatTimeHHMM(date);

  if (isSameCalendarDay(date, now)) {
    return `Hoy • ${time}`;
  }
  if (isSameCalendarDay(date, yesterday)) {
    return `Ayer • ${time}`;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year} • ${time}`;
}

export function formatNumberOnly(amountCLP: number, currency: Currency): string {
  const conf = CURRENCY_RATES[currency];
  const val = amountCLP * conf.rate;
  if (currency === 'CLP') {
    return `$${Math.round(val).toLocaleString('es-CL')}`;
  }
  return conf.symbol + val.toLocaleString(currency === 'USD' ? 'en-US' : 'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** @deprecated Wrapper temporal — usar calculateBrewControlFinancials. Se eliminará en Entregable 2+. */
export function calculateRecipeFinancials(recipe?: Recipe | null) {
  const empty = {
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

  if (!recipe || !recipe.ingredients || !recipe.indirectCosts) {
    return empty;
  }

  const fin = calculateBrewControlFinancials(recipe);
  const unitVolumeL = fin.formatMl / 1000;
  const indirectCost = fin.productionCostsTotal + fin.totalPackagingCost;
  const totalCost = fin.totalCommercialCost;
  const suggestedPricePerLiter =
    unitVolumeL > 0 ? fin.precioFinal / unitVolumeL : fin.precioFinal;

  const ingredientsPercent =
    totalCost > 0 ? Math.round((fin.ingredientsCost / totalCost) * 100) : 70;
  const indirectPercent = totalCost > 0 ? 100 - ingredientsPercent : 30;

  return {
    ingredientsCost: fin.ingredientsCost,
    indirectCost,
    totalCost,
    costPerLiter: fin.costPerLiter,
    costPerBottle: fin.finalCostPerUnit,
    suggestedPricePerBottle: fin.precioFinal,
    suggestedPricePerLiter,
    projectedProfit: fin.utilidadTotal,
    ingredientsPercent,
    indirectPercent,
  };
}
