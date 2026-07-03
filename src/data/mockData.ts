import { Recipe, BreweryProfile, NotificationItem } from '../types';

export const CURRENCY_RATES = {
  CLP: { rate: 1, symbol: '$', suffix: 'CLP', decimals: 0 },
  USD: { rate: 0.00105, symbol: '$', suffix: 'USD', decimals: 2 },
  EUR: { rate: 0.00098, symbol: '€', suffix: 'EUR', decimals: 2 },
};

export const INITIAL_PROFILE: BreweryProfile = {
  name: '',
  masterBrewer: '',
  email: '',
  defaultCurrency: 'CLP',
  monthlyProductionTargetL: 1000,
  inventoryAutoSync: true,
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const PREDEFINED_INGREDIENTS = {
  maltas: [
    { name: 'Malta Pale Ale', pricePerKg: 0 },
    { name: 'Malta Pilsen', pricePerKg: 0 },
    { name: 'Malta Caramelo 60L', pricePerKg: 0 },
    { name: 'Malta Munich I', pricePerKg: 0 },
    { name: 'Malta Chocolate', pricePerKg: 0 },
    { name: 'Trigo Malteado', pricePerKg: 0 },
    { name: 'Avena en Hojuelas', pricePerKg: 0 },
  ],
  lupulos: [
    { name: 'Lúpulo Fuggles', pricePerKg: 0 },
    { name: 'Lúpulo Citra', pricePerKg: 0 },
    { name: 'Lúpulo Mosaic', pricePerKg: 0 },
    { name: 'Lúpulo Cascade', pricePerKg: 0 },
    { name: 'Lúpulo Saaz', pricePerKg: 0 },
    { name: 'Lúpulo Simcoe', pricePerKg: 0 },
  ],
  levaduras: [
    { name: 'Levadura Ale (US-05 / S-04)', pricePerKg: 0 },
    { name: 'Levadura Nottingham Ale', pricePerKg: 0 },
    { name: 'Levadura Lager (W-34/70)', pricePerKg: 0 },
    { name: 'Levadura Belgian Abbaye', pricePerKg: 0 },
  ],
  adjuntos: [
    { name: 'Clarificante (Irish Moss)', pricePerKg: 0 },
    { name: 'Cáscara de Naranja Amarga', pricePerKg: 0 },
    { name: 'Semillas de Cilantro', pricePerKg: 0 },
    { name: 'Nutriente de Levadura', pricePerKg: 0 },
  ],
};

export const INITIAL_RECIPES: Recipe[] = [];

export const DEFAULT_BLANK_RECIPE: Recipe = {
  id: 'draft-initial',
  code: 'LOTE-001',
  name: 'Mi Primer Lote',
  style: 'Estilo Libre',
  volumeL: 100,
  og: 1.050,
  abv: 5.0,
  ibu: 20,
  status: 'BORRADOR',
  lastModified: 'Recién creado',
  bottleSizeMl: 330,
  desiredMargin: 30,
  ingredients: [],
  indirectCosts: {
    agua: 0,
    gas: 0,
    arriendo: 0,
    botella: 0,
    tapas: 0,
    barril: 0,
    acopleSankey: 0,
    etiquetas: 0,
    lata: 0,
    caja: 0,
    envasadoOtros: 0,
    luz: 0,
    limpieza: 0,
    otros: 0,
    transporte: 0,
    co2: 0,
    manoDeObra: 0,
    custom: [],
    applyIva: true,
    redcompraCommission: 0,
    otherDiscounts: 0,
    pricingMode: 'automatic',
    salePrice: 0,
  },
  logEvents: [],
};
