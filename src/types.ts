export type NavigationTab = 'dashboard' | 'costeo' | 'recetas' | 'historial' | 'configuracion' | 'ayuda';

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
  etiquetas: number;
  luz: number;
  transporte: number;
  co2: number;
  manoDeObra: number;
  custom: CustomExpense[];
}

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

/** Fila de public.profiles (1:1 con auth.users). */
export interface UserProfile {
  id: string;
  brewery_name: string | null;
  master_brewer: string | null;
  role: string;
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
