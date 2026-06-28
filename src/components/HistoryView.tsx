import React, { useState } from 'react';
import { Recipe, Currency } from '../types';
import { formatNumberOnly, calculateRecipeFinancials } from '../utils/formatters';
import { Search, Calendar, Filter, Download, MoreVertical } from 'lucide-react';

interface HistoryViewProps {
  recipes: Recipe[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onExport: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  recipes,
  currency,
  onCurrencyChange,
  onSelectRecipe,
  onExport,
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

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-6 animate-in fade-in duration-200 select-none pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#031d34]">Historial de Costeos</h1>
          <p className="text-base text-[#44474c] mt-1.5">Registro detallado de lotes procesados y sus métricas financieras.</p>
        </div>

        {/* Currency Switch */}
        <div className="flex bg-[#eef4ff] rounded-lg p-1 border border-[#c4c6cc] h-fit shrink-0">
          {(['CLP', 'USD', 'EUR'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => onCurrencyChange(c)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                currency === c ? 'bg-white text-[#031d34] shadow-xs' : 'text-[#74777d] hover:text-[#031d34]'
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777d]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por lote o receta..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c4c6cc] rounded-xl text-sm text-[#031d34] font-medium focus:border-[#795900] focus:ring-1 focus:ring-[#795900] outline-none shadow-2xs transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c4c6cc] rounded-xl text-xs font-bold text-[#44474c] hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs cursor-pointer">
            <Calendar className="w-4 h-4 text-[#0f1c2c]" />
            <span>Últimos 30 días</span>
          </button>

          <div className="relative">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c4c6cc] rounded-xl text-xs font-bold text-[#44474c] hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs outline-none cursor-pointer appearance-none pr-8"
            >
              <option value="all">Estilo: Todos</option>
              {styles.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-[#0f1c2c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c4c6cc] rounded-xl text-xs font-bold text-[#44474c] hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs ml-auto md:ml-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#0f1c2c]" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white border border-[#c4c6cc]/70 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eef4ff] border-b border-[#c4c6cc]/60">
                <th className="py-3.5 px-5 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap">Fecha</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap">Lote / Receta</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap text-right">Litros</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap text-right">Costo Total</th>
                <th className="py-3.5 px-5 text-xs font-bold text-[#44474c] uppercase tracking-wider whitespace-nowrap text-right">Precio Sugerido</th>
                <th className="py-3.5 px-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-[#031d34]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No se encontraron lotes que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const fin = calculateRecipeFinancials(item);

                  return (
                    <tr 
                      key={item.id}
                      onClick={() => onSelectRecipe(item)}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-5 whitespace-nowrap text-xs text-[#74777d] font-medium">
                        {item.lastModified}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-sm text-[#031d34] flex items-center gap-2">
                          <span>{item.code}</span>
                        </div>
                        <div className="text-xs text-[#74777d] mt-0.5">{item.style} - "{item.name}"</div>
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-sm font-semibold text-[#031d34]">
                        {item.volumeL.toLocaleString()} L
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-sm font-bold text-[#031d34]">
                        {formatNumberOnly(fin.totalCost, currency)}
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-sm font-bold text-[#d4a017]">
                        {formatNumberOnly(fin.suggestedPricePerLiter, currency)}/L
                      </td>
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button className="text-slate-400 hover:text-[#031d34] p-1 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between mt-auto">
          <span className="text-xs font-semibold text-slate-500">
            Mostrando 1-{filtered.length} de {filtered.length} lotes costeadoss
          </span>
          <div className="flex gap-1">
            <button disabled className="px-3 py-1 text-xs rounded border border-slate-200 text-slate-400 bg-white disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 font-bold">1</button>
            <button disabled className="px-3 py-1 text-xs rounded border border-slate-200 text-slate-400 bg-white disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};
