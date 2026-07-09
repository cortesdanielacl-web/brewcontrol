import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../BrandLogo';

const linkClass =
  'text-sm text-bc-muted transition-colors duration-250 hover:text-bc-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bc-action rounded-sm';

const legalLinkClass =
  'text-xs text-bc-muted/75 transition-colors duration-250 hover:text-bc-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bc-action rounded-sm';

export const LandingFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bc-gray-light">
      <div className="landing-section-divider" aria-hidden />

      <div className="landing-container landing-section--compact flex flex-col items-center">
        <BrandLogo variant="horizontal" theme="light" className="h-8 w-auto" />

        <nav
          aria-label="Enlaces del pie de página"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
        >
          <Link to="/login" className={linkClass}>
            Iniciar sesión
          </Link>
          <Link to="/register" className={linkClass}>
            Crear cuenta
          </Link>
          <a href="#" className={linkClass}>
            Contacto
          </a>
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a href="#" className={legalLinkClass}>
            Política de privacidad
          </a>
          <span aria-hidden className="select-none text-bc-border">
            ·
          </span>
          <a href="#" className={legalLinkClass}>
            Términos
          </a>
        </div>

        <p className="mt-10 text-xs tracking-wide text-bc-muted/65">
          © {year} <span translate="no">BrewControl</span>
        </p>
      </div>
    </footer>
  );
};
