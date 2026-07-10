import React from 'react';
import type { AdminNavigationTab, NavigationTab } from '../types';
import { AdminCerveceriasView } from './admin/AdminCerveceriasView';
import { AdminDashboardView } from './admin/AdminDashboardView';

interface AdminViewProps {
  section: AdminNavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

const SECTION_COPY: Record<
  Exclude<AdminNavigationTab, 'admin-cervecerias' | 'admin-dashboard'>,
  { title: string; description: string }
> = {
  'admin-recetas': {
    title: 'Recetas',
    description: 'Supervisión de recetas a nivel plataforma — disponible próximamente.',
  },
};

export const AdminView: React.FC<AdminViewProps> = ({ section, onNavigate }) => {
  if (section === 'admin-dashboard') {
    return <AdminDashboardView onNavigate={onNavigate} />;
  }

  if (section === 'admin-cervecerias') {
    return <AdminCerveceriasView />;
  }

  const copy = SECTION_COPY[section];

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8 flex flex-col gap-4 animate-in fade-in duration-200 select-none pb-16">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">{copy.title}</h1>
      <p className="text-base text-[#475569]">
        {copy.description} Panel de administración de{' '}
        <span translate="no">BrewControl</span>.
      </p>
    </div>
  );
};
