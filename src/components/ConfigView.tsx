import React from 'react';
import { BreweryProfile, Currency } from '../types';
import { Save, Database, Beer, LogOut } from 'lucide-react';

interface ConfigViewProps {
  profile: BreweryProfile;
  onUpdateProfile: (p: BreweryProfile) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onSignOut: () => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({
  profile,
  onUpdateProfile,
  currency,
  onCurrencyChange,
  onSignOut,
}) => {
  const [toast, setToast] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 select-none pb-16 relative">
      {toast && (
        <div className="fixed top-20 right-8 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50">
          <p className="text-xs font-bold">Configuración guardada correctamente</p>
        </div>
      )}

      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#031d34]">Configuración</h1>
        <p className="text-base text-[#44474c] mt-1.5">Ajusta los parámetros de tu planta cervecera, inventario y fiscalidad.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <section className="bg-white rounded-2xl border border-[#c4c6cc]/70 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
            <Beer className="w-5 h-5 text-[#d4a017]" />
            <h2 className="text-lg font-bold text-[#031d34]">Perfil de Cervecería</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre de Cervecería</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm text-[#031d34] font-medium outline-none focus:border-[#795900]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Maestro Cervecero</label>
              <input
                type="text"
                value={profile.masterBrewer}
                onChange={(e) => onUpdateProfile({ ...profile, masterBrewer: e.target.value })}
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm text-[#031d34] font-medium outline-none focus:border-[#795900]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Correo de Notificaciones</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => onUpdateProfile({ ...profile, email: e.target.value })}
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm text-[#031d34] font-medium outline-none focus:border-[#795900]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Moneda Principal de Costeo</label>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm text-[#031d34] font-bold outline-none focus:border-[#795900] cursor-pointer"
              >
                <option value="CLP">Pesos Chilenos ($ CLP)</option>
                <option value="USD">Dólar Estadounidense ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#c4c6cc]/70 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-[#031d34]">Inventario y Merma de Bodega</h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-sm font-bold text-[#031d34]">Sincronización Automática de Precios</p>
                <p className="text-xs text-slate-500 mt-0.5">Actualizar costos de maltas y lúpulos según facturas recientes en inventario</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.inventoryAutoSync}
                  onChange={(e) => onUpdateProfile({ ...profile, inventoryAutoSync: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D1B2A]" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Objetivo Mensual de Cocción (Lts)</label>
                <input
                  type="number"
                  value={profile.monthlyProductionTargetL}
                  onChange={(e) => onUpdateProfile({ ...profile, monthlyProductionTargetL: Number(e.target.value) })}
                  className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2 text-sm font-mono font-bold text-[#031d34]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Porcentaje Estándar de Merma en Trub (%)</label>
                <input
                  type="number"
                  defaultValue={8}
                  className="w-full bg-[#f8f9ff] border border-[#c4c6cc] rounded-xl px-4 py-2 text-sm font-mono font-bold text-[#031d34]"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onSignOut}
            className="border border-red-200 text-red-700 hover:bg-red-50 active:scale-95 transition-all px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
          <button
            type="submit"
            className="bg-[#0D1B2A] text-white hover:bg-[#1b324a] active:scale-95 transition-all px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#ffc641]" />
            Guardar Parámetros
          </button>
        </div>
      </form>
    </div>
  );
};
