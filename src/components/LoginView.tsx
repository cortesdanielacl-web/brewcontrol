import React, { useState } from 'react';
import { FlaskConical, Lock, Mail, User, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginUserData {
  email: string;
  name: string;
  masterBrewer: string;
}

interface LoginViewProps {
  onLogin: (data: LoginUserData) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [breweryName, setBreweryName] = useState('');
  const [masterBrewer, setMasterBrewer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa el correo y la contraseña.');
      return;
    }

    if (isRegistering && (!breweryName || !masterBrewer)) {
      setError('Por favor indica el nombre de tu cervecería y maestro cervecero.');
      return;
    }

    // Simple auth implementation
    const nameToUse = isRegistering ? breweryName : (email.split('@')[0].toUpperCase() + ' CERVECERÍA');
    const brewerToUse = isRegistering ? masterBrewer : 'Maestro Cervecero';

    onLogin({
      email,
      name: nameToUse,
      masterBrewer: brewerToUse,
    });
  };

  const handleDemoLogin = () => {
    onLogin({
      email: 'maestro@cervecerialibre.cl',
      name: 'Cervecería Artesanal Libre',
      masterBrewer: 'Carlos Cervecero',
    });
  };

  return (
    <div className="min-h-screen bg-[#0f1c2c] flex flex-col justify-center items-center p-4 md:p-6 relative overflow-hidden select-none">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="w-16 h-16 bg-[#ffc641] rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
          <FlaskConical className="w-9 h-9 text-[#0f1c2c]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          BrewControl
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Sistema de Costeo y Gestión de Cervecería Artesanal
        </p>
      </div>

      {/* Login / Register Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-[#0f1c2c]">
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            {isRegistering ? 'Ya tengo cuenta' : 'Registrar nueva cervecería'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre de la Cervecería
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={breweryName}
                    onChange={(e) => setBreweryName(e.target.value)}
                    placeholder="Ej. Cervecería Valdiviana"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Maestro Cervecero
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={masterBrewer}
                    onChange={(e) => setMasterBrewer(e.target.value)}
                    placeholder="Ej. Daniela Cortés"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Correo Electrónico / Usuario
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@cerveceria.cl"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-amber-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f1c2c] hover:bg-[#1b324a] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>{isRegistering ? 'Registrarse y Entrar' : 'Ingresar'}</span>
            <ArrowRight className="w-4 h-4 text-[#ffc641]" />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <span className="relative bg-white px-3 text-xs font-semibold text-slate-400">
            ó acceso rápido
          </span>
        </div>

        {/* Demo Instant Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-xs md:text-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Ingresar con Cuenta Demo</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-500 flex items-center gap-1.5 z-10">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Tus datos se guardan de forma segura localmente en tu sesión.</span>
      </div>
    </div>
  );
};
