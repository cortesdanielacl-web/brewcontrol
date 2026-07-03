export type NavigationTab = 'dashboard' | 'costeo' | 'recetas' | 'historial' | 'administracion' | 'configuracion' | 'ayuda';

export type Currency = 'CLP' | 'USD' | 'EUR';

export type IngredientCategory = 'maltas' | 'lupulos' | 'levaduras' | 'adjuntos';

export interface IngredientItem {
  id: string;
  name: string;
  category: IngredientCategory;
  quantityKg: number;
  pricePerKg: number;
}

export interface CustomExpense {
  id: string;
  name: string;
  amount: number;
}

export interface IndirectCosts {
  agua: number;
  gas: number;
  arriendo: number;
  botella: number;
  tapas: number;
  barril: number;
  acopleSankey: number;
  etiquetas: number;
  lata: number;
  caja: number;
  envasadoOtros: number;
  luz: number;
  limpieza: number;
  otros: number;
  transporte: number;
  co2: number;
  manoDeObra: number;
  custom: CustomExpense[];
  /** Etapa 4 — persistido en indirect_costs (jsonb) */
  applyIva?: boolean;
  redcompraCommission?: number;
  otherDiscounts?: number;
  pricingMode?: PricingMode;
  salePrice?: number;
}

export type PackagingFormatMl = 330 | 500 | 473 | 20000 | 30000 | 50000;
export type PackagingType = 'bottle' | 'can' | 'keg';
export type KegCapacityL = 20 | 30 | 50;

export type PricingMode = 'automatic' | 'manual';

export type BatchStatus = 'EN PROGRESO' | 'COMPLETADO' | 'PLANIFICADO' | 'BORRADOR';

export interface BatchLogEvent {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  status: 'done' | 'active' | 'pending';
}

export interface Recipe {
  id: string;
  code: string; // e.g. "LOTE-042" or "REC-01"
  name: string;
  style: string;
  volumeL: number;
  og: number;
  abv: number;
  ibu: number;
  status: BatchStatus;
  lastModified: string;
  bottleSizeMl: number; // e.g. 330
  desiredMargin: number; // percentage e.g. 60 or 45
  ingredients: IngredientItem[];
  indirectCosts: IndirectCosts;
  logEvents?: BatchLogEvent[];
  costoLitro?: number | null;
}

export interface BreweryProfile {
  name: string;
  masterBrewer: string;
  email: string;
  defaultCurrency: Currency;
  monthlyProductionTargetL: number;
  inventoryAutoSync: boolean;
}

export type UserRole = 'admin' | 'user';

/** Fila de public.profiles (1:1 con auth.users). */
export interface UserProfile {
  id: string;
  brewery_name: string | null;
  master_brewer: string | null;
  role: UserRole;
  active: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'success' | 'info';
  read: boolean;
}
