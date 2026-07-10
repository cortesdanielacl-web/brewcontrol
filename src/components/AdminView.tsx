import React from 'react';
import type { AdminNavigationTab } from '../types';
import { AdminCerveceriasView } from './admin/AdminCerveceriasView';

interface AdminViewProps {
  section: AdminNavigationTab;
}

const SECTION_COPY: Record<
  Exclude<AdminNavigationTab, 'admin-cervecerias'>,
  { title: string; description: string }
> = {
  'admin-dashboard': {
    title: 'Dashboard Admin',
    description: 'Vista general de la plataforma — disponible próximamente.',
  },
  'admin-recetas': {
    title: 'Recetas',
    description: 'Supervisión de recetas a nivel plataforma — disponible próximamente.',
  },
};

export const AdminView: React.FC<AdminViewProps> = ({ section }) => {
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
