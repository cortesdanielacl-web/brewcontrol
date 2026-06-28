import React from 'react';
import { NavigationTab, BreweryProfile } from '../types';
import { 
  LayoutDashboard, 
  LineChart, 
  BookOpen, 
  History, 
  Settings, 
  HelpCircle, 
  Plus,
  Beer
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onNewBatchClick: () => void;
  profile: BreweryProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onNewBatchClick,
  profile,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'costeo', label: 'Nuevo Costeo', icon: <LineChart className="w-5 h-5" /> },
    { id: 'recetas', label: 'Mis Recetas', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'historial', label: 'Historial', icon: <History className="w-5 h-5" /> },
    { id: 'configuracion', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full w-[280px] fixed left-0 top-0 bg-[#0f1c2c] text-white shadow-lg z-40 py-6 px-4 shrink-0 transition-all duration-300 select-none">
      {/* Header / Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-md">
          <Beer className="w-6 h-6 text-[#0f1c2c]" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight text-white leading-none">BrewControl</span>
          <span className="text-[11px] font-semibold text-[#ffc641] tracking-widest mt-1 opacity-90">V1: COSTEAR</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mb-6 px-1">
        <button
          onClick={onNewBatchClick}
          className="w-full bg-[#ffc641] text-[#715300] hover:bg-[#ffdfa0] active:scale-[0.98] transition-all duration-150 py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Nuevo Lote
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 flex flex-col gap-1.5 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-black/40 text-[#ffc641] shadow-inner border-l-4 border-[#ffc641] pl-2.5'
                  : 'text-[#bac8dc] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-[#ffc641]' : 'opacity-80'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer & User Profile */}
      <div className="mt-auto pt-4 border-t border-white/10 px-1 flex flex-col gap-3">
        <button
          onClick={() => onTabChange('ayuda')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
            activeTab === 'ayuda' ? 'text-[#ffc641] bg-white/10' : 'text-[#bac8dc] hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-5 h-5 opacity-80" />
          <span>Ayuda</span>
        </button>

        {/* User Snippet */}
        <div 
          onClick={() => onTabChange('configuracion')}
          className="mt-2 flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
          title="Configurar Perfil"
        >
          <div className="w-8 h-8 rounded-full bg-[#d1e4ff] text-[#0f1c2c] flex items-center justify-center font-bold text-sm shrink-0 uppercase">
            {profile.masterBrewer.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate group-hover:text-[#ffc641] transition-colors">{profile.masterBrewer}</p>
            <p className="text-[10px] text-[#778598] truncate">{profile.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
