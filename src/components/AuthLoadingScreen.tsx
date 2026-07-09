import { Loader2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BRAND_BACKGROUND } from '../constants/branding';

export function AuthLoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 text-white"
      style={{ backgroundColor: BRAND_BACKGROUND }}
    >
      <BrandLogo variant="icon" theme="dark" className="h-20 w-auto" />
      <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
      <p className="text-sm font-semibold text-slate-300">Verificando sesión...</p>
    </div>
  );
}
