import React, { useState } from 'react';
import { Recipe, Currency } from '../types';
import { formatNumberOnly, calculateRecipeFinancials, formatLastModifiedDisplay } from '../utils/formatters';
import { Search, Calendar, Filter, Download, Eye, FileSpreadsheet, FileText, History } from 'lucide-react';
import {
  COMING_SOON_TOOLTIP,
  comingSoonIconButtonClassName,
  comingSoonToolbarButtonClassName,
} from '../constants/ux';

interface HistoryViewProps {
  recipes: Recipe[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  /** Conservado por compatibilidad; exportación deshabilitada hasta próxima versión. */
  onExport?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  recipes,
  currency,
  onCurrencyChange,
  onSelectRecipe,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  const styles = Array.from(new Set(recipes.map((r) => r.style)));

  const filtered = recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.style.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = selectedStyle === 'all' || r.style === selectedStyle;
    return matchesSearch && matchesStyle;
  });

  const emptyMessage = (() => {
    if (recipes.length === 0) {
      return 'Aún no hay evaluaciones registradas. Completa una evaluación de receta para verla aquí.';
    }
    if (searchTerm.trim() || selectedStyle !== 'all') {
      return 'No se encontraron evaluaciones que coincidan con los filtros aplicados.';
    }
    return 'No se encontraron evaluaciones.';
  })();

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-6 animate-in fade-in duration-200 select-none pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">Historial de Evaluaciones de Receta</h1>
          <p className="text-base text-[#475569] mt-1.5">Registro de evaluaciones y sus métricas financieras.</p>
        </div>

        {/* Currency Switch */}
        <div className="bc-segmented flex h-fit shrink-0">
          {(['CLP', 'USD', 'EUR'] as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCurrencyChange(c)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                currency === c ? 'bg-white text-[#0D1B2A] bc-shadow' : 'text-[#64748B] hover:text-[#0D1B2A]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por receta o código..."
            className="w-full pl-10 pr-4 py-2.5 bc-input bg-white text-sm text-[#0D1B2A] font-medium focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TOOLTIP}
            className={comingSoonToolbarButtonClassName}
          >
            <Calendar className="w-4 h-4" />
            <span>Últimos 30 días</span>
          </button>

          <div className="relative">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="flex items-center gap-2 px-4 py-2.5 bc-input bg-white text-xs font-bold text-[#475569] hover:bg-white transition-colors whitespace-nowrap outline-none cursor-pointer appearance-none pr-8"
              aria-label="Filtrar por estilo"
            >
              <option value="all">Estilo: Todos</option>
              {styles.map((st) => (
                <option key={st} value={st} translate="no">{st}</option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-[#0D1B2A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            disabled
            aria-disabled="true"
            title={COMING_SOON_TOOLTIP}
            className={`${comingSoonToolbarButtonClassName} ml-auto md:ml-0`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white bc-card rounded-3xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b bc-divider">
                <th className="py-3.5 px-5 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">Fecha</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">Receta</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-right">Litros</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-right">Costo Total</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-right">Precio Sugerido</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EEF5] text-sm text-[#0D1B2A]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const fin = calculateRecipeFinancials(item);

                  return (
                    <tr 
                      key={item.id}
                      onClick={() => onSelectRecipe(item)}
                      className="hover:bg-bc-action/10/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {formatLastModifiedDisplay(item.lastModified)}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-sm text-[#0D1B2A] flex items-center gap-2">
                          <span>{item.code}</span>
                        </div>
                        <div className="text-xs text-[#64748B] mt-0.5">
                          <span translate="no">{item.style}</span> - &quot;{item.name}&quot;
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-sm font-semibold text-[#0D1B2A]">
                        {item.volumeL.toLocaleString()} L
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-sm font-bold text-[#0D1B2A]">
                        {formatNumberOnly(fin.totalCost, currency)}
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-sm font-bold text-[#F5A623]">
                        {formatNumberOnly(fin.suggestedPricePerLiter, currency)}/L
                      </td>
                      <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            title={COMING_SOON_TOOLTIP}
                            aria-label={`Ver detalle — ${COMING_SOON_TOOLTIP}`}
                            className={comingSoonIconButtonClassName}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            title={COMING_SOON_TOOLTIP}
                            aria-label={`Exportar Excel — ${COMING_SOON_TOOLTIP}`}
                            className={comingSoonIconButtonClassName}
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            title={COMING_SOON_TOOLTIP}
                            aria-label={`Exportar PDF — ${COMING_SOON_TOOLTIP}`}
                            className={comingSoonIconButtonClassName}
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t bc-divider bg-slate-50/50 flex items-center justify-between mt-auto">
          <span className="text-xs font-semibold text-slate-500">
            Mostrando {filtered.length} de {recipes.length} evaluaciones
          </span>
          <div className="flex gap-1" title={COMING_SOON_TOOLTIP}>
            <button type="button" disabled aria-disabled="true" className="px-3 py-1 text-xs rounded text-slate-400 bg-white cursor-not-allowed">Anterior</button>
            <button type="button" disabled aria-disabled="true" className="px-3 py-1 text-xs rounded text-slate-400 bg-white font-bold cursor-not-allowed">1</button>
            <button type="button" disabled aria-disabled="true" className="px-3 py-1 text-xs rounded text-slate-400 bg-white cursor-not-allowed">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};
