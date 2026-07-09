import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LandingReveal } from './LandingReveal';

export const LandingCTA: React.FC = () => {
  return (
    <section aria-labelledby="landing-cta-title" className="relative bg-bc-gray-light">
      <div className="landing-section-divider" aria-hidden />

      <div className="landing-container landing-section landing-section--cta text-center">
        <LandingReveal className="landing-cta-content mx-auto max-w-[42rem] space-y-5">
          <h2 id="landing-cta-title" className="landing-section-title">
            Tu próxima cerveza merece un buen negocio.
          </h2>
          <p className="landing-section-lead mx-auto text-bc-text-secondary">
            Conoce el costo real de producción y toma decisiones con la tranquilidad de saber
            exactamente cuánto cuesta producir cada receta.
          </p>
        </LandingReveal>

        <LandingReveal delay={80} className="mt-8 lg:mt-10">
          <Link
            to="/register"
            className="landing-btn landing-btn--primary landing-btn--lg group"
            aria-label="Crear cuenta en BrewControl"
          >
            Crear cuenta
            <ArrowRight className="h-5 w-5 text-bc-yellow transition-transform duration-250 group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <p className="mt-4 text-sm text-bc-text-secondary">Sin tarjeta de crédito.</p>
        </LandingReveal>
      </div>
    </section>
  );
};
