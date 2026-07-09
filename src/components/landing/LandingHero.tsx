import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LANDING_PHOTOS } from '../../constants/landingAssets';
import { LandingDashboardPreview } from './LandingDashboardPreview';
import { LandingPhoto } from './LandingPhoto';
import { LandingReveal } from './LandingReveal';

const TRUST_POINTS = [
  'Sin instalaciones',
  'Acceso desde cualquier navegador',
  'Diseñado para cervecerías artesanales',
] as const;

const HERO_TITLE_LINE_1 = 'Fija precios con tranquilidad.';
const HERO_TITLE_LINE_2 = 'Conoce el costo real de cada receta.';

const HeroBadge: React.FC<{ overlay?: boolean }> = ({ overlay = false }) => (
  <span
    className={`inline-flex w-fit items-center gap-2 rounded-full border border-bc-border bg-white font-semibold text-bc-navy bc-shadow ${
      overlay ? 'landing-hero-badge px-3 py-1' : 'px-4 py-1.5 text-sm'
    }`}
  >
    Para cervecerías artesanales
  </span>
);

const HeroTitle: React.FC<{ overlay?: boolean }> = ({ overlay = false }) => (
  <h1
    className={
      overlay
        ? 'landing-hero-title text-white'
        : 'landing-section-title'
    }
  >
    {HERO_TITLE_LINE_1}
    <br />
    {HERO_TITLE_LINE_2}
  </h1>
);

export const LandingHero: React.FC = () => {
  const [photoFailed, setPhotoFailed] = useState(false);

  const showDashboardFallback = photoFailed;

  return (
    <section className="relative overflow-hidden bg-bc-gray-light">
      <div className="landing-container relative landing-section--hero">
        <LandingReveal immediate className="landing-media-frame mx-auto w-full">
          {showDashboardFallback ? (
            <LandingDashboardPreview />
          ) : (
            <div className="landing-photo-frame landing-photo-frame--hero relative w-full">
              <LandingPhoto
                variant="hero"
                priority
                src={LANDING_PHOTOS.heroCostAnalysis}
                alt="Cervecero utilizando BrewControl en su cervecería artesanal"
                onError={() => setPhotoFailed(true)}
                className="[&_.landing-photo]:h-auto [&_.landing-photo]:min-h-0 [&_.landing-photo__img]:h-auto [&_.landing-photo__img]:object-contain"
              />

              <div
                className="landing-hero-read-zone pointer-events-none absolute"
                aria-hidden
              />

              <div className="landing-hero-copy pointer-events-none absolute inset-0">
                <div className="absolute top-[6%] right-[3%] flex max-w-[540px] -translate-y-[25px] flex-col items-end gap-4 sm:top-[7%] sm:right-[4%] lg:top-[8%] lg:right-[5%]">
                  <HeroBadge overlay />
                  <div className="relative z-[1] w-full max-w-[540px]">
                    <HeroTitle overlay />
                  </div>
                </div>
              </div>
            </div>
          )}
        </LandingReveal>

        <LandingReveal
          immediate
          delay={120}
          className="mx-auto mt-8 flex max-w-[42rem] flex-col items-center gap-6 text-center sm:mt-10 lg:mt-12 lg:gap-7"
        >
          {showDashboardFallback && (
            <>
              <HeroBadge />
              <HeroTitle />
            </>
          )}

          <p className="landing-section-lead mx-auto text-bc-text-secondary">
            Detrás de cada cerveza hay tiempo, ingredientes y muchas horas de trabajo.{' '}
            <span translate="no">BrewControl</span> te
            ayuda a entender cuánto cuesta realmente producir para tomar decisiones con confianza y
            hacer crecer tu negocio.
          </p>

          <Link
            to="/register"
            className="landing-btn landing-btn--primary landing-btn--lg group -mt-1"
            aria-label="Crear cuenta en BrewControl"
          >
            Crear cuenta
            <ArrowRight className="h-5 w-5 text-bc-yellow transition-transform duration-250 group-hover:translate-x-0.5" aria-hidden />
          </Link>

          <ul className="-mt-2 flex flex-col items-center gap-3 text-sm font-medium text-bc-text-secondary">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5">
                <span className="text-bc-yellow" aria-hidden>
                  •
                </span>
                {point}
              </li>
            ))}
          </ul>
        </LandingReveal>
      </div>
    </section>
  );
};
