import React from 'react';

export const AdminView: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8 flex flex-col gap-4 animate-in fade-in duration-200 select-none pb-16">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">Administración</h1>
      <p className="text-base text-[#475569]">
        Panel de administración — disponible próximamente en una versión futura de{' '}
        <span translate="no">BrewControl</span>.
      </p>
    </div>
  );
};
