import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BrandLogo } from './BrandLogo';
import { BRAND_BACKGROUND } from '../constants/branding';

type LoginViewProps = {
  mode?: 'login' | 'register';
};

export const LoginView: React.FC<LoginViewProps> = ({ mode = 'login' }) => {
  const { signIn, signUp } = useAuth();
  const isRegistering = mode === 'register';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [breweryName, setBreweryName] = useState('');
  const [masterBrewer, setMasterBrewer] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetMessages = () => {
    setError('');
    setInfo('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password) {
      setError('Por favor completa el correo y la contraseña.');
      return;
    }

    if (isRegistering && (!breweryName || !masterBrewer)) {
      setError('Por favor indica el nombre de tu cervecería y maestro cervecero.');
      return;
    }

    setSubmitting(true);

    try {
      if (isRegistering) {
        const { error: signUpError } = await signUp(email, password, {
          breweryName,
          masterBrewer,
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        setInfo(
          'Cuenta creada correctamente. Si tu proyecto requiere confirmación por correo, revisa tu bandeja de entrada.',
        );
      } else {
        const { error: signInError } = await signIn(email, password);

        if (signInError) {
          setError(signInError.message);
        }
        // Sesión activa → GuestRoute redirige a /dashboard
      }
    } finally {
      setSubmitting(false);
    }
  };

  const trustMessages = [
    'Tus recetas permanecen privadas.',
    'Motor financiero consistente.',
    'Diseñado para cervecerías artesanales.',
  ];

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden select-none"
      style={{ backgroundColor: BRAND_BACKGROUND }}
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-bc-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-6">
        <div className="flex flex-col items-center mb-8 md:mb-10 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300 text-center px-4">
          <BrandLogo
            variant="horizontal"
            theme="dark"
            className="h-[86px] md:h-[101px] w-auto max-w-[min(100%,468px)]"
          />
        </div>

        <div className="w-full max-w-[560px] bg-white bc-card rounded-3xl p-8 md:p-10 z-10 animate-in fade-in zoom-in-95 duration-200">
          <h2 className="text-xl font-bold text-[#0D1B2A] mb-8">
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {info && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <span>✓</span> {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                      placeholder=""
                      className="w-full bc-input pl-10 pr-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-bc-action focus:bg-white transition-colors"
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
                      placeholder=""
                      className="w-full bc-input pl-10 pr-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-bc-action focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  autoComplete="email"
                  className="w-full bc-input pl-10 pr-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-bc-action focus:bg-white transition-colors"
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
                  placeholder=""
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  className="w-full bc-input pl-10 pr-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-bc-action focus:bg-white transition-colors"
                />
              </div>
            </div>

            {!isRegistering && (
              <div className="flex justify-end -mb-1">
                <button
                  type="button"
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-500 transition-colors duration-200 cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bc-btn-primary disabled:cursor-not-allowed font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 mt-2 bc-shadow hover:-translate-y-px transition-all duration-200 ease-out active:scale-[0.98] active:translate-y-0 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F5A623]" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>{isRegistering ? 'Crear cuenta' : 'Ingresar'}</span>
                  <ArrowRight className="w-4 h-4 text-[#F5A623]" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              {isRegistering ? (
                <Link
                  to="/login"
                  onClick={resetMessages}
                  className="text-xs font-medium text-slate-400 hover:text-slate-500 transition-colors duration-200"
                >
                  Ya tengo cuenta
                </Link>
              ) : (
                <Link
                  to="/register"
                  onClick={resetMessages}
                  className="text-xs font-medium text-slate-400 hover:text-slate-500 transition-colors duration-200"
                >
                  Crear cuenta
                </Link>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t bc-divider flex flex-col gap-2.5">
            {trustMessages.map((message) => (
              <p
                key={message}
                className="text-[11px] text-slate-400 flex items-center gap-2"
              >
                <span className="text-emerald-500/70 shrink-0" aria-hidden="true">
                  ✓
                </span>
                {message}
              </p>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 pb-5 pt-2 text-center text-[10px] text-slate-600/70 tracking-wide">
        <p>
          <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">
            Volver al inicio
          </Link>
        </p>
        <p className="mt-2">Versión 1.0</p>
        <p className="mt-0.5">
          © <span translate="no">BrewControl</span>
        </p>
      </footer>
    </div>
  );
};
