import React from 'react';
import { Recipe, Currency, NavigationTab } from '../types';
import { formatCurrency, formatNumberOnly, calculateRecipeFinancials } from '../utils/formatters';
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
  MoreHorizontal,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Inbox
} from 'lucide-react';

interface DashboardViewProps {
  recipe?: Recipe | null;
  currency: Currency;
  onEditRecipe: (recipe: Recipe) => void;
  onExport: () => void;
  onTabChange: (t: NavigationTab) => void;
  onStartFirstBatch?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  recipe,
  currency,
  onEditRecipe,
  onExport,
  onTabChange,
  onStartFirstBatch,
}) => {
  const fin = recipe ? calculateRecipeFinancials(recipe) : null;

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Context Header */}
      {!recipe ? (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Instalación Nueva
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#031d34] mt-3">
              Bienvenido a BrewControl
            </h1>
            <p className="text-slate-600 text-base mt-2 leading-relaxed">
              Aún no has registrado ningún lote. Crea tu primer costeo para comenzar a calcular el costo real de tu cerveza.
            </p>
          </div>
          <button
            onClick={() => {
              if (onStartFirstBatch) onStartFirstBatch();
              else onTabChange('costeo');
            }}
            className="shrink-0 bg-[#1b324a] text-white hover:bg-[#031d34] active:scale-95 transition-all px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-[#ffc641]" />
            + Crear mi primer lote
          </button>
        </section>
      ) : (
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#ffc641] text-[#715300] font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider shadow-2xs">
                {recipe.status}
              </span>
              <span className="font-mono text-xs font-semibold text-[#44474c] bg-[#e5efff] px-2.5 py-1 rounded-md border border-[#d1e4ff]">
                {recipe.code}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#031d34]">
              {recipe.name}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-[#44474c] text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                <FlaskConical className="w-4 h-4 text-[#0f1c2c]" /> 
                {recipe.volumeL}L Volumen
              </span>
              <span className="text-[#c4c6cc]">•</span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                <Percent className="w-4 h-4 text-[#0f1c2c]" /> 
                {recipe.abv}% ABV
              </span>
              <span className="text-[#c4c6cc]">•</span>
              <span className="text-xs text-slate-500">Estilo: {recipe.style}</span>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={onExport}
              className="text-xs font-bold text-[#795900] bg-white hover:bg-[#ffdfa0] hover:text-[#261a00] active:scale-95 transition-all px-4 py-2.5 rounded-lg border border-[#795900] flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" /> 
              Exportar
            </button>
            <button
              onClick={() => {
                onEditRecipe(recipe);
                onTabChange('costeo');
              }}
              className="text-xs font-bold bg-[#1b324a] text-white hover:bg-[#031d34] active:scale-95 transition-all px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#ffc641]" /> 
              Editar Costos
            </button>
          </div>
        </section>
      )}

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Cost */}
        <div className="bg-white rounded-xl border border-[#c4c6cc]/70 p-5 flex flex-col justify-between h-36 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#44474c] uppercase tracking-wider">Costo Total</span>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-[#031d34] tracking-tight font-mono">
              {fin ? formatNumberOnly(fin.totalCost, currency) : formatNumberOnly(0, currency)}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5 block">{currency} Producción</span>
          </div>
        </div>

        {/* Cost per Liter */}
        <div className="bg-white rounded-xl border border-[#c4c6cc]/70 p-5 flex flex-col justify-between h-36 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#44474c] uppercase tracking-wider">Costo x Litro</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-[#031d34] tracking-tight font-mono">
              {fin ? formatNumberOnly(fin.costPerLiter, currency) : formatNumberOnly(0, currency)}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">
              {recipe ? `Lote de ${recipe.volumeL} Lts` : 'Lote de 0 Lts'}
            </span>
          </div>
        </div>

        {/* Cost per Bottle */}
        <div className="bg-white rounded-xl border border-[#c4c6cc]/70 p-5 flex flex-col justify-between h-36 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#44474c] uppercase tracking-wider">Costo x Botella</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <Wine className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-[#031d34] tracking-tight font-mono">
              {fin ? formatNumberOnly(fin.costPerBottle, currency) : formatNumberOnly(0, currency)}
            </div>
            <div className="text-xs font-semibold text-[#74777d] mt-1">Ref: {recipe ? recipe.bottleSizeMl : 330}ml</div>
          </div>
        </div>

        {/* Margin */}
        <div className="bg-white rounded-xl border border-[#c4c6cc]/70 p-5 flex flex-col justify-between h-36 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#44474c] uppercase tracking-wider">Margen Estimado</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-[#795900]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-[#795900] tracking-tight">
              {recipe ? `${recipe.desiredMargin}%` : '0%'}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">Rentabilidad Objetivo</span>
          </div>
        </div>

        {/* Suggested Price */}
        <div className="bg-white rounded-xl border border-[#c4c6cc]/70 p-5 flex flex-col justify-between h-36 hover:shadow-md transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#44474c] uppercase tracking-wider">Precio Sugerido</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-[#031d34] tracking-tight font-mono">
              {fin ? formatNumberOnly(fin.suggestedPricePerBottle, currency) : formatNumberOnly(0, currency)}
            </div>
            <div className="text-xs font-semibold text-[#74777d] mt-1">x Botella {recipe ? recipe.bottleSizeMl : 330}ml</div>
          </div>
        </div>
      </section>

      {/* Charts & Log Area */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Distribution (Large Card) */}
        <div className="bg-white rounded-xl border border-[#c4c6cc]/70 p-6 lg:col-span-2 flex flex-col justify-between gap-8 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#031d34]">Distribución de Costos</h2>
              <p className="text-xs text-slate-500 mt-0.5">Proporción directa entre materia prima y gastos operacionales</p>
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {!recipe || !fin ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-sm">
                Aún no existen lotes costeados para generar estadísticas.
              </p>
            </div>
          ) : (
            <>
              {/* Visual Bar & Figures */}
              <div className="flex flex-col gap-4">
                <div className="flex items-end justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase">Ingredientes ({fin.ingredientsPercent}%)</span>
                    <span className="font-mono text-xl font-bold text-[#1b324a] mt-0.5">
                      {formatCurrency(fin.ingredientsCost, currency)}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-500 uppercase">Indirectos ({fin.indirectPercent}%)</span>
                    <span className="font-mono text-xl font-bold text-[#d4a017] mt-0.5">
                      {formatCurrency(fin.indirectCost, currency)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-9 rounded-full flex overflow-hidden shadow-inner bg-slate-100 p-1 border border-slate-200">
                  <div 
                    className="bg-[#1b324a] h-full rounded-l-full flex items-center px-4 transition-all duration-500"
                    style={{ width: `${Math.max(fin.ingredientsPercent, 15)}%` }}
                  >
                    <span className="text-xs font-bold text-white tracking-wider">{fin.ingredientsPercent}%</span>
                  </div>
                  <div 
                    className="bg-[#ffc641] h-full rounded-r-full flex items-center justify-end px-4 transition-all duration-500 flex-1"
                  >
                    <span className="text-xs font-bold text-[#715300] tracking-wider">{fin.indirectPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Top Ingredients breakdown */}
              <div className="border-t border-slate-100 pt-5 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Ingredientes en Receta</h3>
                  <button 
                    onClick={() => {
                      onEditRecipe(recipe);
                      onTabChange('costeo');
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Modificar receta <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="flex flex-col gap-3 text-sm text-[#031d34]">
                  {recipe.ingredients.slice(0, 4).map((item, idx) => {
                    const itemCost = item.quantityKg * item.pricePerKg;
                    const colors = ['bg-[#1b324a]', 'bg-[#1b324a]/80', 'bg-[#1b324a]/60', 'bg-[#1b324a]/40'];
                    return (
                      <li key={item.id || idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="flex items-center gap-2.5 font-medium">
                          <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                          <span>{item.name} <span className="text-xs text-slate-400 font-mono">({item.quantityKg}kg)</span></span>
                        </span>
                        <span className="font-mono font-bold text-slate-700">
                          {formatNumberOnly(itemCost, currency)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions / Batch Log (Small Card) */}
        <div className="bg-white rounded-xl border border-[#c4c6cc]/70 p-6 flex flex-col justify-between gap-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#031d34]">Registro de Lotes</h2>
            <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">Bitácora</span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
            {!recipe || !recipe.logEvents || recipe.logEvents.length === 0 ? (
              <>
                <FlaskConical className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-500">
                  Todavía no has elaborado ningún lote.
                </p>
              </>
            ) : (
              <div className="w-full flex flex-col gap-4 text-left">
                {recipe.logEvents.map((ev) => (
                  <div key={ev.id} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#031d34]">{ev.title}</p>
                      <p className="text-xs text-slate-500">{ev.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => onTabChange('historial')}
            className="w-full mt-auto text-xs font-bold text-slate-600 hover:text-[#031d34] bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors py-3 rounded-lg text-center border border-slate-200 cursor-pointer"
          >
            Ver bitácora completa de lotes
          </button>
        </div>
      </section>
    </div>
  );
};
