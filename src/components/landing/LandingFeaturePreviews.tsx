import React from 'react';
import {
  Beer,
  Calendar,
  ChevronRight,
  DollarSign,
  Droplet,
  FlaskConical,
  Percent,
  Save,
  Search,
  Tag,
  TrendingUp,
  Wine,
} from 'lucide-react';
import { LandingAppFrame } from './LandingAppFrame';

function PreviewKpiCard({
  label,
  value,
  sublabel,
  icon: Icon,
  variant = 'default',
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ElementType;
  variant?: 'default' | 'accent';
}) {
  const isAccent = variant === 'accent';

  return (
    <div
      className={`flex h-28 flex-col justify-between rounded-2xl p-4 ${
        isAccent
          ? 'border border-bc-yellow/40 bg-bc-navy'
          : 'border border-bc-border bg-white'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[10px] font-bold uppercase leading-tight tracking-wider ${
            isAccent ? 'text-bc-yellow' : 'text-bc-text-secondary'
          }`}
        >
          {label}
        </span>
        <div
          className={`rounded-lg p-1.5 ${
            isAccent ? 'bg-bc-yellow/15 text-bc-yellow' : 'bg-bc-gray-light text-bc-muted'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div>
        <div
          className={`font-data-mono text-xl font-black tracking-tight ${
            isAccent ? 'text-white' : 'text-bc-navy'
          }`}
        >
          {value}
        </div>
        <span className="mt-0.5 block text-[10px] font-semibold text-bc-muted">{sublabel}</span>
      </div>
    </div>
  );
}

export const LandingDashboardFeaturePreview: React.FC = () => {
  return (
    <LandingAppFrame>
      <div className="space-y-5 bg-bc-gray-light p-4 md:p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-bc-yellow px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bc-navy">
              Evaluado
            </span>
            <span className="rounded-md border border-bc-border bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-bc-text-secondary">
              REC-042
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-bc-navy" translate="no">IPA del Sur</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-bc-text-secondary">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1">
              <FlaskConical className="h-3.5 w-3.5 text-bc-navy" />
              100L Volumen
            </span>
            <span className="text-bc-border">•</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1" translate="no">
              <Percent className="h-3.5 w-3.5 text-bc-navy" />
              6.2% ABV
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <PreviewKpiCard
            label="Costo total de la receta"
            value="$845.000"
            sublabel="CLP · total receta"
            icon={DollarSign}
          />
          <PreviewKpiCard
            label="Costo de producción"
            value="$8.450"
            sublabel="$/L · 100 L objetivo"
            icon={Droplet}
            variant="accent"
          />
          <PreviewKpiCard
            label="Costo x Botella"
            value="$2.780"
            sublabel="330 ml"
            icon={Wine}
          />
          <PreviewKpiCard
            label="Precio Sugerido"
            value="$3.640"
            sublabel="x Botella 330 ml"
            icon={Tag}
          />
          <PreviewKpiCard
            label="Margen"
            value="30%"
            sublabel="Rentabilidad Objetivo"
            icon={TrendingUp}
          />
        </div>
      </div>
    </LandingAppFrame>
  );
};

export const LandingEvaluationFeaturePreview: React.FC = () => {
  const ingredients = [
    { name: 'Malta Pale Ale', qty: '18 kg', cost: '$162.000' },
    { name: 'Lúpulo Cascade', qty: '250 g', cost: '$48.500' },
    { name: 'Levadura US-05', qty: '2 sobres', cost: '$12.400' },
  ];

  return (
    <LandingAppFrame>
      <div className="space-y-5 bg-bc-gray-light p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-bc-muted">
              Paso 2 de 4 · Ingredientes
            </p>
            <h3 className="mt-1 text-xl font-black tracking-tight text-bc-navy" translate="no">IPA del Sur</h3>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={`h-1.5 w-8 rounded-full ${step <= 2 ? 'bg-bc-yellow' : 'bg-bc-border'}`}
              />
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-bc-border bg-white">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-bc-border bg-bc-gray-light px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-bc-muted">
            <span>Ingrediente</span>
            <span className="text-right">Cantidad</span>
            <span className="text-right">Costo</span>
          </div>
          {ingredients.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-bc-border px-4 py-3 last:border-b-0"
            >
              <span className="text-sm font-semibold text-bc-navy">{item.name}</span>
              <span className="text-right text-xs font-medium text-bc-text-secondary">{item.qty}</span>
              <span className="text-right font-data-mono text-sm font-bold text-bc-navy">{item.cost}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-bc-yellow/40 bg-bc-navy px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-wider text-bc-yellow">
            Costo parcial de la receta
          </span>
          <span className="font-data-mono text-lg font-black text-white">$222.900</span>
        </div>
      </div>
    </LandingAppFrame>
  );
};

export const LandingHistoryFeaturePreview: React.FC = () => {
  const rows = [
    { code: 'REC-042', name: 'IPA del Sur', style: 'IPA', cost: '$8.450/L', date: '12 mar 2026' },
    { code: 'REC-038', name: 'Stout Patagonia', style: 'Stout', cost: '$7.920/L', date: '28 feb 2026' },
    { code: 'REC-031', name: 'Lager Andina', style: 'Lager', cost: '$6.180/L', date: '14 feb 2026' },
  ];

  return (
    <LandingAppFrame>
      <div className="space-y-4 bg-bc-gray-light p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-black tracking-tight text-bc-navy">Historial de evaluaciones</h3>
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bc-muted" />
            <div className="rounded-xl border border-bc-border bg-white py-2 pl-9 pr-3 text-xs font-medium text-bc-muted">
              Buscar por receta o código...
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-bc-border bg-white px-3 py-1.5 text-[10px] font-bold text-bc-text-secondary">
            <Calendar className="h-3.5 w-3.5" />
            Últimos 30 días
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-bc-border bg-white">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 border-b border-bc-border bg-bc-gray-light px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-bc-muted">
            <span>Código</span>
            <span>Receta</span>
            <span className="hidden sm:block">Estilo</span>
            <span>Costo/L</span>
            <span className="hidden md:block">Fecha</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.code}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 border-b border-bc-border px-4 py-3 last:border-b-0"
            >
              <span className="rounded-md bg-bc-gray-light px-2 py-0.5 font-mono text-[10px] font-semibold text-bc-text-secondary">
                {row.code}
              </span>
              <span className="text-sm font-semibold text-bc-navy" translate="no">{row.name}</span>
              <span className="hidden text-xs text-bc-text-secondary sm:block" translate="no">{row.style}</span>
              <span className="font-data-mono text-xs font-bold text-bc-navy">{row.cost}</span>
              <span className="hidden text-xs text-bc-muted md:block">{row.date}</span>
            </div>
          ))}
        </div>
      </div>
    </LandingAppFrame>
  );
};

export const LandingConfigFeaturePreview: React.FC = () => {
  return (
    <LandingAppFrame>
      <div className="space-y-5 bg-bc-gray-light p-4 md:p-5">
        <div>
          <h3 className="text-xl font-black tracking-tight text-bc-navy">Configuración</h3>
          <p className="mt-1 text-xs text-bc-muted">Ajusta los parámetros de tu cervecería.</p>
        </div>

        <div className="rounded-2xl border border-bc-border bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Beer className="h-4 w-4 text-bc-yellow" />
            <span className="text-sm font-bold text-bc-navy">Perfil de Cervecería</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-bc-muted">
                Nombre de Cervecería
              </label>
              <div className="rounded-xl border border-bc-border bg-bc-gray-light px-3 py-2 text-sm font-medium text-bc-navy">
                Cervecería del Sur
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-bc-muted">
                Maestro Cervecero
              </label>
              <div className="rounded-xl border border-bc-border bg-bc-gray-light px-3 py-2 text-sm font-medium text-bc-navy">
                Ana Rojas
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-bc-border bg-white p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-bc-muted">
            Moneda predeterminada
          </p>
          <div className="inline-flex rounded-xl border border-bc-border bg-bc-gray-light p-1">
            {(['CLP', 'USD', 'EUR'] as const).map((currency) => (
              <span
                key={currency}
                className={`rounded-lg px-3 py-1 text-xs font-bold ${
                  currency === 'CLP'
                    ? 'bg-white text-bc-navy bc-shadow'
                    : 'text-bc-muted'
                }`}
              >
                {currency}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-bc-action">
            Ver más opciones
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl bc-btn-primary px-4 py-2 text-xs font-bold">
            <Save className="h-3.5 w-3.5 text-bc-yellow" />
            Guardar
          </span>
        </div>
      </div>
    </LandingAppFrame>
  );
};
