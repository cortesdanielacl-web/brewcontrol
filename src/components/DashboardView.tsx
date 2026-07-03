import React from 'react';
import { Recipe, Currency, NavigationTab } from '../types';
import {
  formatCurrency,
  formatNumberOnly,
  calculateRecipeFinancials,
  calculateStage2Financials,
  calculateStage4Financials,
  calculateFullKegBarrels,
  calculateKegRemainingLiters,
  calculatePackagingUnits,
  formatPackagingUnits,
  getKegCapacityL,
  getPackagingType,
  normalizePackagingFormatMl,
} from '../utils/formatters';
import {
  FlaskConical,
  Percent,
  Download,
  Edit3,
  DollarSign,
  Droplet,
  Wine,
  TrendingUp,
  Tag,
  PlusCircle,
  ClipboardList,
  Construction,
} from 'lucide-react';

interface DashboardViewProps {
  recipe?: Recipe | null;
  currency: Currency;
  onEditRecipe: (recipe: Recipe) => void;
  onExport: () => void;
  onTabChange: (t: NavigationTab) => void;
  onStartFirstBatch?: () => void;
}

const exportButtonSoonClassName =
  'text-xs font-bold bg-slate-100 text-slate-400 px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-not-allowed';

function SummaryField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">{label}</p>
      <p className="text-sm font-medium text-[#0D1B2A]">{value}</p>
    </div>
  );
}

function SummarySectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 mb-5">
      {children}
    </h3>
  );
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  recipe,
  currency,
  onEditRecipe,
  onExport: _onExport,
  onTabChange,
  onStartFirstBatch,
}) => {
  const fin = recipe ? calculateRecipeFinancials(recipe) : null;
  const stage2 = recipe ? calculateStage2Financials(recipe) : null;
  const stage4 = recipe ? calculateStage4Financials(recipe) : null;

  const formatMl = recipe ? normalizePackagingFormatMl(recipe.bottleSizeMl) : 330;
  const packagingType = getPackagingType(formatMl);
  const isKeg = packagingType === 'keg';
  const capacityL = getKegCapacityL(formatMl);
  const fullBarrels = recipe ? calculateFullKegBarrels(recipe.volumeL, capacityL) : 0;
  const remainingLiters = recipe ? calculateKegRemainingLiters(recipe.volumeL, capacityL) : 0;
  const bottleCanUnits = recipe ? calculatePackagingUnits(recipe.volumeL, formatMl) : 0;

  const formatCostLabel =
    packagingType === 'keg'
      ? 'Costo x Barril'
      : packagingType === 'can'
        ? 'Costo x Lata'
        : 'Costo x Botella';

  const formatPriceLabel =
    packagingType === 'keg'
      ? `x Barril ${capacityL} L`
      : packagingType === 'can'
        ? `x Lata ${formatMl} ml`
        : `x Botella ${formatMl} ml`;

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Context Header */}
      {!recipe ? (
        <section className="bg-white bc-card rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="bg-bc-action/10 text-bc-action font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Instalación Nueva
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0D1B2A] mt-3">
              Bienvenido a BrewControl
            </h1>
            <p className="text-slate-600 text-base mt-2 leading-relaxed">
              Aún no has registrado ninguna receta.
              <br />
              Crea tu primera evaluación para comenzar a calcular el costo real de tu cerveza.
            </p>
          </div>
          <button
            onClick={() => {
              if (onStartFirstBatch) onStartFirstBatch();
              else onTabChange('costeo');
            }}
            className="shrink-0 bc-btn-primary active:scale-95 transition-all px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-[#F5A623]" />
            + Crear mi primer lote
          </button>
        </section>
      ) : (
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#F5A623] text-[#0D1B2A] font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                {recipe.status}
              </span>
              <span className="font-mono text-xs font-semibold text-[#475569] bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E9EEF5]">
                {recipe.code}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">
              {recipe.name}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-[#475569] text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full">
                <FlaskConical className="w-4 h-4 text-[#0D1B2A]" />
                {recipe.volumeL}L Volumen
              </span>
              <span className="text-[#c4c6cc]">•</span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full">
                <Percent className="w-4 h-4 text-[#0D1B2A]" />
                {recipe.abv}% ABV
              </span>
              <span className="text-[#c4c6cc]">•</span>
              <span className="text-xs text-slate-500">Estilo: {recipe.style}</span>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Próximamente"
              className={exportButtonSoonClassName}
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide">Próximamente</span>
            </button>
            <button
              onClick={() => {
                onEditRecipe(recipe);
                onTabChange('costeo');
              }}
              className="text-xs font-bold bc-btn-primary active:scale-95 transition-all px-5 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#F5A623]" />
              Editar receta
            </button>
          </div>
        </section>
      )}

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Costo total del lote */}
        <div className="bg-white bc-card rounded-3xl p-5 flex flex-col justify-between h-36 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Costo Total del Lote</span>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-[#0D1B2A] tracking-tight font-mono">
              {fin ? formatNumberOnly(fin.totalCost, currency) : formatNumberOnly(0, currency)}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5 block">{currency} Producción</span>
          </div>
        </div>

        {/* Costo real de producción ($/L) — indicador principal */}
        <div className="bg-[#0D1B2A] rounded-3xl border border-[#F5A623]/40 p-5 flex flex-col justify-between h-36 bc-shadow transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F5A623] uppercase tracking-wider leading-tight">
              Costo Real de Producción
            </span>
            <div className="p-2 bg-[#F5A623]/15 rounded-lg text-[#F5A623]">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight font-mono">
              {fin ? formatNumberOnly(fin.costPerLiter, currency) : formatNumberOnly(0, currency)}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">
              {recipe ? `$/L · Lote de ${recipe.volumeL} Lts` : '$/L · Lote de 0 Lts'}
            </span>
          </div>
        </div>

        {/* Costo por formato de venta */}
        <div className="bg-white bc-card rounded-3xl p-5 flex flex-col justify-between h-36 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider leading-tight">
              {formatCostLabel}
            </span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <Wine className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-[#0D1B2A] tracking-tight font-mono">
              {fin ? formatNumberOnly(fin.costPerBottle, currency) : formatNumberOnly(0, currency)}
            </div>
            <div className="text-xs font-semibold text-[#64748B] mt-1">
              {stage4?.formatLabel ?? `${formatMl} ml`}
            </div>
          </div>
        </div>

        {/* Precio sugerido */}
        <div className="bg-white bc-card rounded-3xl p-5 flex flex-col justify-between h-36 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Precio Sugerido</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-[#0D1B2A] tracking-tight font-mono">
              {fin ? formatNumberOnly(fin.suggestedPricePerBottle, currency) : formatNumberOnly(0, currency)}
            </div>
            <div className="text-xs font-semibold text-[#64748B] mt-1">{formatPriceLabel}</div>
          </div>
        </div>

        {/* Margen */}
        <div className="bg-white bc-card rounded-3xl p-5 flex flex-col justify-between h-36 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Margen</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-[#F5A623]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#F5A623] tracking-tight">
              {recipe ? `${recipe.desiredMargin}%` : '0%'}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">Rentabilidad Objetivo</span>
          </div>
        </div>
      </section>

      {/* Resumen & Producción */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen de la receta */}
        <div className="bg-white bc-card rounded-3xl p-6 lg:col-span-2 flex flex-col gap-8">
          <div className="pb-5">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-5 h-5 text-[#F5A623]" />
              <h2 className="text-xl font-bold text-[#0D1B2A]">Última receta evaluada</h2>
            </div>
          </div>

          {recipe && fin && stage2 && (
            <div className="flex flex-col gap-8">
              {/* Información general */}
              <div>
                <SummarySectionTitle>Información general</SummarySectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SummaryField label="Estilo" value={recipe.style || '—'} />
                  <SummaryField
                    label="Litros objetivo"
                    value={`${recipe.volumeL.toLocaleString('es-CL')} L`}
                  />
                  <SummaryField label="ABV" value={`${recipe.abv}%`} />
                  <SummaryField label="IBU" value={recipe.ibu.toLocaleString('es-CL')} />
                </div>
              </div>

              {/* Costos */}
              <div>
                <SummarySectionTitle>Costos</SummarySectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SummaryField
                    label="Costo ingredientes"
                    value={
                      <span className="font-mono font-bold">
                        {formatCurrency(stage2.ingredientsCost, currency)}
                      </span>
                    }
                  />
                  <SummaryField
                    label="Costo producción"
                    value={
                      <span className="font-mono font-bold">
                        {formatCurrency(stage2.productionCostsTotal, currency)}
                      </span>
                    }
                  />
                  <SummaryField
                    label="Costo real del lote"
                    value={
                      <span className="font-mono font-bold">
                        {formatCurrency(stage2.totalBatchCost, currency)}
                      </span>
                    }
                  />
                  <SummaryField
                    label="Costo real de producción ($/L)"
                    value={
                      <span className="font-mono font-bold text-[#F5A623]">
                        {formatCurrency(stage2.costPerLiter, currency)}
                      </span>
                    }
                  />
                </div>
              </div>

              {/* Formato comercial */}
              <div>
                <SummarySectionTitle>Formato comercial</SummarySectionTitle>
                {isKeg ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SummaryField label="Capacidad" value={`${capacityL.toLocaleString('es-CL')} L`} />
                    <SummaryField
                      label="Barriles completos"
                      value={fullBarrels.toLocaleString('es-CL')}
                    />
                    {remainingLiters > 0 && (
                      <SummaryField
                        label="Barril adicional"
                        value={`${remainingLiters.toLocaleString('es-CL')} L`}
                      />
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SummaryField label="Formato" value={stage4?.formatLabel ?? `${formatMl} ml`} />
                    <SummaryField
                      label="Cantidad de unidades"
                      value={formatPackagingUnits(bottleCanUnits, packagingType)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Producción */}
        <div className="bg-white bc-card rounded-3xl p-6 flex flex-col gap-6">
          <div className="pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Construction className="w-5 h-5 text-[#F5A623]" />
              <h2 className="text-xl font-bold text-[#0D1B2A]">🚧 Producción</h2>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Próximamente
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
            <Construction className="w-10 h-10 text-slate-300 mb-4" />
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">
              La gestión de producción estará disponible en una próxima versión de BrewControl.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
