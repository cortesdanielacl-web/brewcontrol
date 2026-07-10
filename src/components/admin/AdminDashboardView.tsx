import React, { useEffect, useState } from 'react';
import type { NavigationTab } from '../../types';
import {
  computeExecutiveMetricsFromBreweries,
  getExecutiveMetrics,
  type ExecutiveMetrics,
} from '../../services/adminMetricsService';
import { listBreweries } from '../../services/adminService';
import { FOUNDER_PRICE_CLP } from '../../constants/launchProgram';
import { formatNumberOnly, formatRecipeDateDisplay } from '../../utils/formatters';
import {
  Activity,
  Building2,
  LayoutDashboard,
  Loader2,
  BookOpen,
  Rocket,
  TrendingUp,
  Users,
  CircleDot,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

function MetricCard({
  label,
  value,
  hint,
  icon,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  if (accent) {
    return (
      <div className="bg-[#0D1B2A] rounded-3xl border border-[#F5A623]/40 p-5 flex flex-col justify-between min-h-[9rem] bc-shadow transition-all">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-[#F5A623] uppercase tracking-wider leading-tight">
            {label}
          </span>
          <div className="p-2 bg-[#F5A623]/15 rounded-lg text-[#F5A623] shrink-0">{icon}</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-black text-white tracking-tight font-mono">{value}</div>
          {hint ? (
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">{hint}</span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bc-card rounded-3xl p-5 flex flex-col justify-between min-h-[9rem] transition-all">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-[#475569] uppercase tracking-wider leading-tight">
          {label}
        </span>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600 shrink-0">{icon}</div>
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-black text-[#0D1B2A] tracking-tight font-mono">
          {value}
        </div>
        {hint ? (
          <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">{hint}</span>
        ) : null}
      </div>
    </div>
  );
}

function LaunchStatusIndicator({ phase }: { phase: ExecutiveMetrics['launch']['phase'] }) {
  const styles: Record<
    ExecutiveMetrics['launch']['phase'],
    { dot: string; ring: string; bg: string; text: string }
  > = {
    beta: {
      dot: 'bg-[#F5A623]',
      ring: 'ring-[#F5A623]/30',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
    },
    fundadores: {
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-500/30',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
    },
    comercial: {
      dot: 'bg-[#1E3A8A]',
      ring: 'ring-[#1E3A8A]/30',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
    },
  };

  const s = styles[phase];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border border-transparent ${s.bg} ${s.text}`}
    >
      <span className={`relative flex h-2.5 w-2.5`}>
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${s.dot}`}
        />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ring-4 ${s.dot} ${s.ring}`} />
      </span>
      En curso
    </span>
  );
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      const { metrics: rpcMetrics, error: rpcError } = await getExecutiveMetrics();

      if (!mounted) return;

      if (rpcMetrics && !rpcError) {
        setMetrics(rpcMetrics);
        setLoading(false);
        return;
      }

      // Fallback: una sola llamada a listBreweries si la RPC aún no está desplegada.
      console.warn('RPC admin_get_executive_metrics no disponible, usando listBreweries:', rpcError);
      const { breweries, error: listError } = await listBreweries();

      if (!mounted) return;

      if (listError) {
        setError(listError.message || 'No se pudieron cargar los indicadores.');
        setMetrics(null);
        setLoading(false);
        return;
      }

      setMetrics(computeExecutiveMetricsFromBreweries(breweries));
      setLoading(false);
    }

    load().catch((err: unknown) => {
      if (!mounted) return;
      console.error('Error al cargar dashboard ejecutivo:', err);
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los indicadores.');
      setMetrics(null);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col items-center justify-center gap-3 min-h-[40vh] animate-in fade-in duration-200 pb-16">
        <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Cargando indicadores...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-4 animate-in fade-in duration-200 pb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">
          Dashboard Ejecutivo
        </h1>
        <div className="bg-white bc-card rounded-3xl p-10 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-600 mb-1">No se pudieron cargar los indicadores</p>
          <p className="text-sm text-slate-500 max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  const { launch, founders, business, activity } = metrics;
  const betaProgress = launch.betaProgressPercent;

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 select-none pb-16">
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">
          Dashboard Ejecutivo
        </h1>
        <p className="text-base text-[#475569] mt-1.5">
          Cómo va <span translate="no">BrewControl</span> como negocio.
        </p>
      </div>

      {/* 1. Estado del lanzamiento */}
      <section className="bg-white bc-card rounded-3xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-[#F5A623] shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
                Estado del lanzamiento
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-[#0D1B2A] tracking-tight">
                {launch.label}
              </h2>
            </div>
          </div>
          <LaunchStatusIndicator phase={launch.phase} />
        </div>

        {/* Espacio preparado para avance de Beta */}
        <div className="rounded-2xl bg-[#F8FAFC] border border-[#E9EEF5] p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">
              Avance de la Beta
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {betaProgress == null ? 'Próximamente' : `${betaProgress}%`}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#E9EEF5] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5A623]/40 transition-all duration-500"
              style={{ width: `${betaProgress ?? 0}%` }}
              aria-hidden
            />
          </div>
          {betaProgress == null ? (
            <p className="text-xs text-slate-400 mt-2 font-medium">
              El seguimiento de hitos de la Beta se habilitará en una próxima iteración.
            </p>
          ) : null}
        </div>
      </section>

      {/* 2. Programa Fundadores */}
      <section className="bg-white bc-card rounded-3xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">
              Programa Fundadores
            </p>
            <h2 className="text-xl md:text-2xl font-black text-[#0D1B2A] tracking-tight">
              Batch Fundador
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E9EEF5] p-4">
            <p className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Cervecerías Fundadoras
            </p>
            <p className="text-3xl font-black text-[#0D1B2A] font-mono">{founders.occupiedSlots}</p>
          </div>
          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E9EEF5] p-4">
            <p className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Total de cupos
            </p>
            <p className="text-3xl font-black text-[#0D1B2A] font-mono">{founders.slotLimit}</p>
          </div>
          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E9EEF5] p-4">
            <p className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Cupos disponibles
            </p>
            <p className="text-3xl font-black text-[#F5A623] font-mono">{founders.availableSlots}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold text-[#475569] uppercase tracking-wider">
              Ocupación del batch
            </span>
            <span className="text-xs font-bold text-[#0D1B2A] font-mono">
              {founders.occupiedSlots}/{founders.slotLimit} · {founders.progressPercent}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-[#E9EEF5] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5A623] transition-all duration-500"
              style={{ width: `${founders.progressPercent}%` }}
              role="progressbar"
              aria-valuenow={founders.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </section>

      {/* 3. Negocio */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#F5A623]" />
          <h2 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Negocio</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            accent
            label="Ingreso mensual actual"
            value={formatNumberOnly(business.monthlyRevenueClp, 'CLP')}
            hint="CLP · suscripciones activas"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricCard
            label="Proyección Batch Fundador"
            value={formatNumberOnly(business.founderBatchProjectionClp, 'CLP')}
            hint={`${founders.slotLimit} × $${FOUNDER_PRICE_CLP.toLocaleString('es-CL')} CLP`}
            icon={<CircleDot className="w-4 h-4" />}
          />
          <MetricCard
            label="Cervecerías activas"
            value={business.activeBreweries}
            icon={<Building2 className="w-4 h-4" />}
          />
          <MetricCard
            label="Cervecerías inactivas"
            value={business.inactiveBreweries}
            icon={<Building2 className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* 4. Actividad */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-[#F5A623]" />
          <h2 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Actividad</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total de cervecerías"
            value={activity.totalBreweries}
            icon={<Building2 className="w-4 h-4" />}
          />
          <MetricCard
            label="Total de recetas"
            value={activity.totalRecipes}
            icon={<BookOpen className="w-4 h-4" />}
          />
          <MetricCard
            label="Última cervecería"
            value={
              <span className="text-lg md:text-xl leading-snug break-words">
                {activity.latestBreweryName || '—'}
              </span>
            }
            hint={
              activity.latestBreweryAt
                ? formatRecipeDateDisplay(activity.latestBreweryAt)
                : undefined
            }
            icon={<Users className="w-4 h-4" />}
          />
          <MetricCard
            label="Última receta"
            value={
              <span className="text-lg md:text-xl leading-snug break-words">
                {activity.latestRecipeName || '—'}
              </span>
            }
            hint={
              activity.latestRecipeAt
                ? formatRecipeDateDisplay(activity.latestRecipeAt)
                : undefined
            }
            icon={<BookOpen className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Accesos rápidos */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('admin-cervecerias')}
            className="bg-white bc-card rounded-3xl p-5 flex items-center gap-4 text-left hover:border-[#F5A623]/50 hover:bg-amber-50/40 transition-all cursor-pointer group"
          >
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 group-hover:bg-amber-50 group-hover:text-[#F5A623] transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-[#0D1B2A]">Administrar cervecerías</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Listado y cuentas</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('admin-recetas')}
            className="bg-white bc-card rounded-3xl p-5 flex items-center gap-4 text-left hover:border-[#F5A623]/50 hover:bg-amber-50/40 transition-all cursor-pointer group"
          >
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 group-hover:bg-amber-50 group-hover:text-[#F5A623] transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-[#0D1B2A]">Ver recetas</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Supervisión de plataforma</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="bg-white bc-card rounded-3xl p-5 flex items-center gap-4 text-left hover:border-[#F5A623]/50 hover:bg-amber-50/40 transition-all cursor-pointer group"
          >
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 group-hover:bg-amber-50 group-hover:text-[#F5A623] transition-colors">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-[#0D1B2A]">Dashboard principal</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Vista de cervecería</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
