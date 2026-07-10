import React, { useEffect, useState } from 'react';
import type { AdminBreweryListItem } from '../../types';
import { listBreweries } from '../../services/adminService';
import { formatRecipeDateDisplay } from '../../utils/formatters';
import { AdminCerveceriaDetailView } from './AdminCerveceriaDetailView';
import { Search, Building2, Eye, Loader2 } from 'lucide-react';

export const AdminCerveceriasView: React.FC = () => {
  const [breweries, setBreweries] = useState<AdminBreweryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    listBreweries()
      .then(({ breweries: rows, error: fetchError }) => {
        if (!mounted) return;

        if (fetchError) {
          console.error('Error al cargar cervecerías:', fetchError);
          setError(fetchError.message || 'No se pudieron cargar las cervecerías.');
          setBreweries([]);
          return;
        }

        setBreweries(rows);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        console.error('Error al cargar cervecerías:', err);
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las cervecerías.');
        setBreweries([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selected = selectedId ? breweries.find((b) => b.id === selectedId) ?? null : null;

  const filtered = breweries.filter((b) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      (b.breweryName ?? '').toLowerCase().includes(q) ||
      (b.masterBrewer ?? '').toLowerCase().includes(q) ||
      (b.email ?? '').toLowerCase().includes(q)
    );
  });

  if (selected) {
    return (
      <AdminCerveceriaDetailView
        brewery={selected}
        onBack={() => setSelectedId(null)}
        onBreweryUpdated={(updated) => {
          setBreweries((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        }}
      />
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 select-none pb-16">
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">Cervecerías</h1>
        <p className="text-base text-[#475569] mt-1.5">
          Administra las cervecerías del Programa Fundadores (Beta).
        </p>
      </div>

      <div className="bg-white bc-card rounded-3xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 pb-6 bg-[#F8FAFC]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cervecería, contacto o correo..."
              className="w-full pl-10 pr-4 py-2.5 bc-input bg-white text-sm text-[#0D1B2A] font-medium focus:border-bc-action focus:ring-1 focus:ring-bc-action/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b bc-divider">
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Cervecería
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Contacto
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Correo
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Rol
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Estado
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Plan
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                  Registro
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-center">
                  Recetas
                </th>
                <th className="py-3.5 px-6 text-xs font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-right">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EEF5] text-sm text-[#0D1B2A]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Loader2 className="w-8 h-8 text-slate-300 mx-auto mb-3 animate-spin" />
                    <p className="text-sm font-medium text-slate-500">Cargando cervecerías...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-600 mb-1">No se pudo cargar el listado</p>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">{error}</p>
                  </td>
                </tr>
              ) : breweries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-600">No hay cervecerías registradas.</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    No hay cervecerías que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filtered.map((brewery) => (
                  <tr key={brewery.id} className="hover:bg-bc-action/10/30 transition-colors group">
                    <td className="py-4 px-6 font-bold text-base text-[#0D1B2A]">
                      {brewery.breweryName || '—'}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {brewery.masterBrewer || '—'}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 break-all">
                      {brewery.email || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          brewery.role === 'admin'
                            ? 'bg-[#0D1B2A] text-[#FBB040] border-slate-700'
                            : 'bg-[#F8FAFC] text-[#0D1B2A] border-[#E9EEF5]'
                        }`}
                      >
                        {brewery.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          brewery.active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {brewery.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-100 capitalize">
                        {brewery.plan}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">
                      {formatRecipeDateDisplay(brewery.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-sm font-bold text-[#0D1B2A]">
                      {brewery.recipeCount}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(brewery.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0D1B2A] hover:text-[#F5A623] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Ver detalle"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t bc-divider bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            {loading
              ? 'Cargando...'
              : `Mostrando ${filtered.length} de ${breweries.length} cervecerías`}
          </span>
        </div>
      </div>
    </div>
  );
};
