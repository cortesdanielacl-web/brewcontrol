import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../BrandLogo';

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`landing-navbar sticky top-0 z-50 ${scrolled ? 'landing-navbar--scrolled' : ''}`}
    >
      <div className="landing-container flex h-14 items-center justify-between">
        <BrandLogo variant="short" theme="light" className="shrink-0" />

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="landing-btn landing-btn--secondary"
            aria-label="Iniciar sesión en BrewControl"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="landing-btn landing-btn--primary"
            aria-label="Crear cuenta en BrewControl"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  );
};
