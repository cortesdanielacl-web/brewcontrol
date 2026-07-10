import React from 'react';
import { NavigationTab, BreweryProfile, AdminNavigationTab } from '../types';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  LineChart,
  BookOpen,
  History,
  Settings,
  HelpCircle,
  Plus,
  Shield,
  Building2,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onNewRecipeClick: () => void;
  profile: BreweryProfile;
}

const ADMIN_NAV_ITEMS: { id: AdminNavigationTab; label: string; icon: React.ReactNode }[] = [
  { id: 'admin-dashboard', label: 'Dashboard Admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'admin-cervecerias', label: 'Cervecerías', icon: <Building2 className="w-5 h-5" /> },
  { id: 'admin-recetas', label: 'Recetas', icon: <BookOpen className="w-5 h-5" /> },
];

export { ADMIN_NAV_ITEMS };

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onNewRecipeClick,
  profile,
}) => {
  const { isAdmin } = useAuth();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'costeo', label: 'Nueva Evaluación de Receta', icon: <LineChart className="w-5 h-5" /> },
    { id: 'recetas', label: 'Mis Recetas', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'historial', label: 'Historial', icon: <History className="w-5 h-5" /> },
    { id: 'configuracion', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
  ];

  const renderNavButton = (item: { id: NavigationTab; label: string; icon: React.ReactNode }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 text-left cursor-pointer ${
          isActive
            ? 'bg-white/10 text-bc-yellow shadow-inner border-l-4 border-bc-yellow pl-2.5'
            : 'text-white/55 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className={isActive ? 'text-bc-yellow' : 'opacity-80'}>{item.icon}</span>
        <span translate={item.id === 'dashboard' || item.id === 'admin-dashboard' ? 'no' : undefined}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <aside className="bc-sidebar hidden md:flex flex-col h-full w-[280px] fixed left-0 top-0 text-white z-40 py-6 px-6 shrink-0 transition-all duration-300 select-none">
      <div className="mb-8">
        <BrandLogo variant="short" theme="dark" className="shrink-0" />
        <span className="mt-2 block text-[11px] font-semibold text-bc-yellow tracking-widest opacity-90">V1: COSTEAR</span>
      </div>

      <div className="mb-6">
        <button
          onClick={onNewRecipeClick}
          className="w-full bg-bc-yellow text-bc-navy hover:bg-[#FBB040] active:scale-[0.98] transition-all duration-150 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bc-shadow cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nueva receta
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map(renderNavButton)}

        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              <Shield className="w-3.5 h-3.5" />
              <span>Administración</span>
            </div>
            {ADMIN_NAV_ITEMS.map(renderNavButton)}
          </div>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-3">
        <button
          onClick={() => onTabChange('ayuda')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'ayuda' ? 'text-bc-yellow bg-white/10' : 'text-white/55 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-5 h-5 opacity-80" />
          <span>Ayuda</span>
        </button>

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onTabChange('configuracion');
            }
          }}
          onClick={() => onTabChange('configuracion')}
          className="mt-2 flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
          title="Configurar perfil"
        >
          <div className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
            {profile.masterBrewer.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate group-hover:text-bc-yellow transition-colors">{profile.masterBrewer}</p>
            <p className="text-[10px] text-white/45 truncate">{profile.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
