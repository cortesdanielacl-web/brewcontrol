import React from 'react';
import {
  BookOpen,
  FileSpreadsheet,
  FileText,
  Plus,
  ClipboardList,
  Sprout,
  Settings2,
  Package,
  TrendingUp,
  StickyNote,
} from 'lucide-react';
import { Recipe, Currency, IngredientCategory, IngredientItem } from '../../types';
import {
  calculateStage2Financials,
  calculateStage3Financials,
  calculateStage4Financials,
  calculateFullKegBarrels,
  calculateKegRemainingLiters,
  calculatePackagingUnits,
  calculateIngredientSubtotal,
  formatAdjuntoQuantity,
  formatCurrency,
  formatPackagingUnits,
  formatRecipeDateDisplay,
  getKegCapacityL,
  getPackagingType,
  normalizePackagingFormatMl,
  PRODUCTION_COST_FIELDS,
  CHILE_IVA_RATE,
  PACKAGING_FORMATS,
} from '../../utils/formatters';
import { RecipeKegPackagingResultSection } from './RecipeKegPackagingResultSection';
import { COMING_SOON_TOOLTIP, comingSoonButtonClassName } from '../../constants/ux';

interface RecipeTechnicalSheetViewProps {
  recipe: Recipe;
  currency: Currency;
  onExportExcel: () => void;
  onBackToList: () => void;
  onNewRecipe: () => void;
}

const INGREDIENT_CATEGORIES: IngredientCategory[] = ['maltas', 'lupulos', 'levaduras', 'adjuntos'];

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  maltas: 'Maltas',
  lupulos: 'Lúpulos',
  levaduras: 'Levaduras',
  adjuntos: 'Adjuntos',
};

function formatIngredientQuantity(item: IngredientItem, category: IngredientCategory): string {
  if (category === 'adjuntos') {
    return formatAdjuntoQuantity(item);
  }
  return `${item.quantityKg.toLocaleString('es-CL')} kg`;
}

function IngredientCategoryTable({
  label,
  category,
  items,
  currency,
}: {
  label: string;
  category: IngredientCategory;
  items: IngredientItem[];
  currency: Currency;
}) {
  const subtotal = items.reduce((acc, item) => acc + calculateIngredientSubtotal(item), 0);

  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-[#0D1B2A]">{label}</h3>
      <div className="overflow-x-auto rounded-3xl border border-[rgba(15,27,42,0.06)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#F8FAFC] border-b bc-divider">
              <th className="py-2.5 px-4 text-xs font-bold text-[#475569] uppercase tracking-wider">Ingrediente</th>
              <th className="py-2.5 px-4 text-xs font-bold text-[#475569] uppercase tracking-wider text-right">Cantidad</th>
              <th className="py-2.5 px-4 text-xs font-bold text-[#475569] uppercase tracking-wider text-right">Precio</th>
              <th className="py-2.5 px-4 text-xs font-bold text-[#475569] uppercase tracking-wider text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9EEF5]">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5 px-4 font-medium text-[#0D1B2A]">{item.name || '—'}</td>
                <td className="py-2.5 px-4 font-mono text-right text-slate-600">
                  {formatIngredientQuantity(item, category)}
                </td>
                <td className="py-2.5 px-4 font-mono text-right text-slate-600">
                  {formatCurrency(item.pricePerKg, currency)}
                </td>
                <td className="py-2.5 px-4 font-mono font-bold text-right text-[#0D1B2A]">
                  {formatCurrency(calculateIngredientSubtotal(item), currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#F8FAFC] border-t bc-divider">
              <td colSpan={3} className="py-2.5 px-4 text-xs font-bold text-[#475569] uppercase tracking-wider text-right">
                Subtotal {label}
              </td>
              <td className="py-2.5 px-4 font-mono font-bold text-right text-[#F5A623]">
                {formatCurrency(subtotal, currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function SheetSection({
  icon,
  title,
  children,
  sectionId,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  sectionId: string;
}) {
  return (
    <section data-section={sectionId} className="bg-white bc-card rounded-3xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4">
        {icon}
        <h2 className="text-lg font-bold text-[#0D1B2A]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoField({
  label,
  value,
  noTranslateLabel,
  noTranslateValue,
}: {
  label: string;
  value: React.ReactNode;
  noTranslateLabel?: boolean;
  noTranslateValue?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p
        className="text-xs font-bold text-[#475569] tracking-wider uppercase"
        translate={noTranslateLabel ? 'no' : undefined}
      >
        {label}
      </p>
      <p className="text-sm font-medium text-[#0D1B2A]" translate={noTranslateValue ? 'no' : undefined}>
        {value}
      </p>
    </div>
  );
}

function ProfitabilitySubBlock({
  title,
  children,
  variant = 'light',
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'light' | 'muted' | 'dark';
}) {
  const styles = {
    light: {
      container: 'bg-[#F8FAFC]/60 border border-[rgba(15,27,42,0.06)]',
      title: 'text-[#0D1B2A]',
    },
    muted: {
      container: 'bg-[#F8FAFC] border border-[rgba(15,27,42,0.06)]',
      title: 'text-[#0D1B2A]',
    },
    dark: {
      container: 'bg-[#0D1B2A] border border-[#F5A623]/30',
      title: 'text-[#F5A623]',
    },
  }[variant];

  return (
    <div className={`rounded-3xl p-5 ${styles.container}`}>
      <h3 className={`text-sm font-bold tracking-wide mb-4 ${styles.title}`}>{title}</h3>
      {children}
    </div>
  );
}

function DarkInfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">{label}</p>
      <p className="text-sm font-mono font-bold text-white">{value}</p>
    </div>
  );
}

const exportButtonSoonClassName = `${comingSoonButtonClassName} font-bold text-sm px-6 py-3 rounded-2xl justify-center`;

export const RecipeTechnicalSheetView: React.FC<RecipeTechnicalSheetViewProps> = ({
  recipe,
  currency,
  onBackToList,
  onNewRecipe,
}) => {
  const stage2 = calculateStage2Financials(recipe);
  const stage3 = calculateStage3Financials(recipe);
  const stage4 = calculateStage4Financials(recipe);

  const formatMl = normalizePackagingFormatMl(recipe.bottleSizeMl);
  const packagingType = getPackagingType(formatMl);
  const isKeg = packagingType === 'keg';
  const capacityL = getKegCapacityL(formatMl);
  const fullBarrels = calculateFullKegBarrels(recipe.volumeL, capacityL);
  const remainingLiters = calculateKegRemainingLiters(recipe.volumeL, capacityL);
  const bottleCanUnits = calculatePackagingUnits(recipe.volumeL, formatMl);
  const formatLabel = PACKAGING_FORMATS.find((f) => f.ml === formatMl)?.label ?? `${formatMl} cc`;

  const ivaAmount = stage4.applyIva ? stage4.precioNeto * CHILE_IVA_RATE : 0;
  const expectedTotalRevenue = stage4.precioFinal * stage4.units;
  const unitsLabel = isKeg
    ? `${stage4.units.toLocaleString('es-CL')} barriles`
    : formatPackagingUnits(stage4.units, packagingType);

  const creationDate = formatRecipeDateDisplay(recipe.lastModified);

  return (
    <div
      id="recipe-technical-sheet"
      data-technical-sheet
      className="max-w-[960px] mx-auto p-4 md:p-8 flex flex-col gap-6 animate-in fade-in duration-200 pb-16 select-none"
    >
      {/* Encabezado */}
      <header data-section="encabezado" className="space-y-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">
            📋 Ficha técnica de la receta
          </h1>
          <p className="text-base text-[#475569] mt-1.5">
            Resumen final del asistente — base para exportación y archivo técnico.
          </p>
        </div>

        <div className="bg-white bc-card rounded-3xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoField label="Nombre de la receta" value={recipe.name || '—'} />
            <InfoField label="Fecha de creación" value={creationDate} />
            <InfoField
              label="Última actualización"
              value={formatRecipeDateDisplay(recipe.lastModified, { includeTime: true })}
            />
          </div>
        </div>
      </header>

      {/* Información general */}
      <SheetSection icon={<ClipboardList className="w-5 h-5 text-[#F5A623]" />} title="Información general" sectionId="informacion-general">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoField label="Estilo" value={recipe.style || '—'} noTranslateValue />
          <InfoField label="Litros objetivo" value={`${recipe.volumeL.toLocaleString('es-CL')} L`} />
          <InfoField label="ABV" value={`${recipe.abv.toFixed(1)}%`} noTranslateLabel />
          <InfoField label="IBU" value={recipe.ibu.toLocaleString('es-CL')} noTranslateLabel />
        </div>
      </SheetSection>

      {/* Ingredientes */}
      <SheetSection icon={<Sprout className="w-5 h-5 text-[#F5A623]" />} title="Ingredientes" sectionId="ingredientes">
        <div className="space-y-6">
          {INGREDIENT_CATEGORIES.map((cat) => (
            <React.Fragment key={cat}>
              <IngredientCategoryTable
                label={CATEGORY_LABELS[cat]}
                category={cat}
                items={recipe.ingredients.filter((i) => i.category === cat)}
                currency={currency}
              />
            </React.Fragment>
          ))}

          {recipe.ingredients.length === 0 && (
            <p className="text-sm text-slate-500 italic">No se registraron ingredientes en esta receta.</p>
          )}

          <div className="bg-[#F8FAFC]/60 rounded-3xl border border-[rgba(15,27,42,0.06)] p-4 flex justify-between items-center">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">Costo total de ingredientes</span>
            <span className="text-xl font-mono font-black text-[#0D1B2A]">
              {formatCurrency(stage2.ingredientsCost, currency)}
            </span>
          </div>
        </div>
      </SheetSection>

      {/* Costos de producción */}
      <SheetSection icon={<Settings2 className="w-5 h-5 text-[#F5A623]" />} title="Costos de producción" sectionId="costos-produccion">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRODUCTION_COST_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex justify-between items-center bg-[#F8FAFC] rounded-lg px-4 py-2.5 border border-[rgba(15,27,42,0.06)]">
                <span className="text-sm text-[#475569]">{label}</span>
                <span className="text-sm font-mono font-bold text-[#0D1B2A]">
                  {formatCurrency(recipe.indirectCosts[key] ?? 0, currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#0D1B2A] rounded-3xl border border-[#F5A623]/30 px-4 py-4 sm:px-5 sm:py-4 bc-shadow">
            <h3 className="text-sm font-bold text-[#F5A623] tracking-wide mb-3">💰 Resumen de costos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mb-0.5 leading-tight">
                  Costo total de ingredientes
                </p>
                <p className="text-base font-mono font-black text-white">
                  {formatCurrency(stage2.ingredientsCost, currency)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mb-0.5 leading-tight">
                  Costos de producción
                </p>
                <p className="text-base font-mono font-black text-white">
                  {formatCurrency(stage2.productionCostsTotal, currency)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mb-0.5 leading-tight">
                  Costo total de la receta
                </p>
                <p className="text-base font-mono font-black text-white">
                  {formatCurrency(stage2.totalBatchCost, currency)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-[#F5A623] tracking-wider uppercase mb-0.5 leading-tight">
                  Costo por litro
                </p>
                <p className="text-xl sm:text-2xl font-mono font-black text-[#F5A623] leading-tight">
                  {formatCurrency(stage2.costPerLiter, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetSection>

      {/* Evaluación comercial */}
      <SheetSection icon={<Package className="w-5 h-5 text-[#F5A623]" />} title="Evaluación comercial" sectionId="evaluacion-comercial">
        {isKeg ? (
          <RecipeKegPackagingResultSection
            volumeL={recipe.volumeL}
            capacityL={capacityL}
            fullBarrels={fullBarrels}
            remainingLiters={remainingLiters}
            costPerBarrel={formatCurrency(stage3.finalCostPerUnit, currency)}
            showTitle={false}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="Formato" value={formatLabel} />
            <InfoField
              label="Cantidad de unidades"
              value={formatPackagingUnits(bottleCanUnits, packagingType)}
            />
            <InfoField label="Costo de envasado" value={formatCurrency(stage3.packagingCostPerUnit, currency)} />
            <InfoField label="Costo final por unidad" value={formatCurrency(stage3.finalCostPerUnit, currency)} />
          </div>
        )}
      </SheetSection>

      {/* Rentabilidad */}
      <SheetSection icon={<TrendingUp className="w-5 h-5 text-[#F5A623]" />} title="Rentabilidad" sectionId="rentabilidad">
        <div className="space-y-5">
          <ProfitabilitySubBlock title="Ingresos">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoField label="Precio de venta por unidad" value={formatCurrency(stage4.precioFinal, currency)} />
              <InfoField label="Cantidad de unidades" value={unitsLabel} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#475569] tracking-wider uppercase">Ingreso total esperado</p>
                <p className="text-lg font-mono font-black text-[#0D1B2A]">
                  {formatCurrency(expectedTotalRevenue, currency)}
                </p>
              </div>
            </div>
          </ProfitabilitySubBlock>

          <ProfitabilitySubBlock title="Gastos comerciales" variant="muted">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoField
                label="IVA"
                value={
                  stage4.applyIva
                    ? `Sí — ${formatCurrency(ivaAmount, currency)} (19%)`
                    : 'No aplicado'
                }
              />
              <InfoField
                label="Comisión venta Redcompra"
                value={`${stage4.redcompraCommission}% — ${formatCurrency(stage4.redcompraAmount, currency)}`}
              />
              {stage4.otherDiscounts > 0 && (
                <InfoField
                  label="Otros descuentos"
                  value={`${stage4.otherDiscounts}% — ${formatCurrency(stage4.otherDiscountAmount, currency)}`}
                />
              )}
            </div>
          </ProfitabilitySubBlock>

          <ProfitabilitySubBlock title="Rentabilidad" variant="dark">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DarkInfoField label="Utilidad por unidad" value={formatCurrency(stage4.utilidadPorUnidad, currency)} />
              <DarkInfoField label="Utilidad total de la receta" value={formatCurrency(stage4.utilidadTotal, currency)} />
              <DarkInfoField label="Margen real" value={`${stage4.margenReal.toFixed(1)}%`} />
            </div>
          </ProfitabilitySubBlock>
        </div>
      </SheetSection>

      {/* Observaciones */}
      <SheetSection icon={<StickyNote className="w-5 h-5 text-[#F5A623]" />} title="Observaciones" sectionId="observaciones">
        <div
          data-observations-placeholder
          className="min-h-[120px] rounded-3xl border-2 border-dashed border-[#E9EEF5] bg-[#F8FAFC] p-4"
          aria-label="Espacio reservado para observaciones futuras"
        >
          <p className="text-xs text-slate-400 italic">
            Espacio reservado para anotaciones. Esta información no se guarda por el momento.
          </p>
        </div>
      </SheetSection>

      {/* Botones de acción */}
      <footer data-section="acciones" className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TOOLTIP}
          className={exportButtonSoonClassName}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Exportar Excel</span>
        </button>

        <button
          type="button"
          disabled
          aria-disabled="true"
          title={COMING_SOON_TOOLTIP}
          className={exportButtonSoonClassName}
        >
          <FileText className="w-4 h-4" />
          <span>Exportar PDF</span>
        </button>

        <button
          type="button"
          onClick={onBackToList}
          className="text-[#0D1B2A] hover:bg-slate-100 active:scale-98 transition-all font-bold text-sm px-6 py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Volver al listado</span>
        </button>

        <button
          type="button"
          onClick={onNewRecipe}
          className="bg-[#F5A623] text-[#0D1B2A] hover:bg-[#FBB040] active:scale-98 transition-all font-bold text-sm px-6 py-3 rounded-2xl bc-shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva receta</span>
        </button>
      </footer>
    </div>
  );
};
