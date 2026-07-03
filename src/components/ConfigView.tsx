import React from 'react';
import { BreweryProfile, Currency } from '../types';
import { Save, Beer } from 'lucide-react';

interface ConfigViewProps {
  profile: BreweryProfile;
  onUpdateProfile: (p: BreweryProfile) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onSave: () => Promise<string | null>;
}

export const ConfigView: React.FC<ConfigViewProps> = ({
  profile,
  onUpdateProfile,
  currency,
  onCurrencyChange,
  onSave,
}) => {
  const [toast, setToast] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaving(true);

    try {
      const error = await onSave();
      if (error) {
        setErrorMessage(error);
        setTimeout(() => setErrorMessage(null), 4000);
        return;
      }

      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-full md:max-w-[75%] mx-auto p-4 md:p-8 flex flex-col gap-8 animate-in fade-in duration-200 select-none pb-16 relative">
      {toast && (
        <div className="fixed top-20 right-8 bg-emerald-600 text-white px-5 py-3 rounded-2xl bc-shadow flex items-center gap-3 z-50">
          <p className="text-xs font-bold">Configuración guardada correctamente</p>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-20 right-8 bg-red-600 text-white px-5 py-3 rounded-2xl bc-shadow flex items-center gap-3 z-50">
          <p className="text-xs font-bold">{errorMessage}</p>
        </div>
      )}

      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0D1B2A]">Configuración</h1>
        <p className="text-sm text-slate-400 mt-1">Ajusta los parámetros de tu planta cervecera, inventario y fiscalidad.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <section className="bg-white bc-card rounded-3xl p-6">
          <div className="flex items-center gap-2.5 mb-6 pb-5">
            <Beer className="w-5 h-5 text-[#F5A623]" />
            <h2 className="text-lg font-bold text-[#0D1B2A]">Perfil de Cervecería</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre de Cervecería</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
                className="w-full bc-input px-4 py-2.5 text-sm text-[#0D1B2A] font-medium outline-none focus:border-bc-action"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Maestro Cervecero</label>
              <input
                type="text"
                value={profile.masterBrewer}
                onChange={(e) => onUpdateProfile({ ...profile, masterBrewer: e.target.value })}
                className="w-full bc-input px-4 py-2.5 text-sm text-[#0D1B2A] font-medium outline-none focus:border-bc-action"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Correo de Notificaciones</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full bg-slate-100 border border-[rgba(15,27,42,0.06)] rounded-2xl px-4 py-2.5 text-sm text-slate-500 font-medium outline-none cursor-default"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Moneda Principal de Evaluación de Receta</label>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="w-full bc-input px-4 py-2.5 text-sm text-[#0D1B2A] font-bold outline-none focus:border-bc-action cursor-pointer"
              >
                <option value="CLP">Pesos Chilenos ($ CLP)</option>
                <option value="USD">Dólar Estadounidense ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0D1B2A] text-white hover:bg-[#122033] active:scale-95 transition-all px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bc-shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 text-[#F5A623]" />
            Guardar Parámetros
          </button>
        </div>
      </form>
    </div>
  );
};
