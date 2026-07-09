import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CircleHelp,
  type LucideIcon,
} from 'lucide-react';
import { LANDING_SCREENSHOTS, toWebpSrc } from '../../constants/landingAssets';
import { LandingReveal } from './LandingReveal';

interface TransformItem {
  before: string;
  after: string;
  icon: LucideIcon;
}

const TRANSFORMATIONS: TransformItem[] = [
  {
    before: 'Fijas precios con aproximaciones.',
    after: 'Fijas precios con datos reales de cada receta.',
    icon: Calculator,
  },
  {
    before: 'Tus recetas viven en cuadernos y planillas sueltas.',
    after: 'Tus recetas están organizadas y siempre disponibles.',
    icon: BookOpen,
  },
  {
    before: 'Decides por intuición, sin saber si ganas o pierdes.',
    after: 'Decides con claridad sobre costos y rentabilidad.',
    icon: CircleHelp,
  },
];

const SolutionScreenshot: React.FC = () => (
  <div className="landing-media-frame landing-solution-media">
    <div className="landing-screenshot-frame landing-screenshot-frame--prominent landing-solution-screenshot overflow-hidden">
      <picture>
        <source srcSet={toWebpSrc(LANDING_SCREENSHOTS.dashboard)} type="image/webp" />
        <img
          src={LANDING_SCREENSHOTS.dashboard}
          alt="Captura del dashboard de BrewControl mostrando costos de la receta"
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </picture>
    </div>
  </div>
);

const TransformRow: React.FC<{ item: TransformItem; showDivider: boolean }> = ({
  item,
  showDivider,
}) => {
  const BeforeIcon = item.icon;

  return (
    <>
      {showDivider && <div className="landing-solution-transform-divider" aria-hidden />}

      <BeforeIcon
        className="landing-solution-cell landing-solution-cell--icon text-bc-muted/70"
        strokeWidth={2}
        aria-hidden
      />

      <div className="landing-solution-cell landing-solution-cell--before min-w-0 text-left">
        <span className="landing-solution-label landing-solution-label--before">
          Sin <span translate="no">BrewControl</span>
        </span>
        <p className="landing-solution-before-text">{item.before}</p>
      </div>

      <div className="landing-solution-cell landing-solution-cell--arrow">
        <ArrowRight className="h-5 w-5 text-bc-yellow" strokeWidth={2.25} aria-hidden />
      </div>

      <div className="landing-solution-cell landing-solution-cell--after min-w-0 text-left">
        <span className="landing-solution-label landing-solution-label--after">Después</span>
        <p className="landing-solution-after-text">{item.after}</p>
      </div>
    </>
  );
};

export const LandingSolution: React.FC = () => {
  return (
    <section aria-labelledby="landing-solution-title" className="relative bg-bc-gray-light">
      <div className="landing-section-divider" aria-hidden />

      <div className="landing-container landing-section landing-section--solution">
        <div className="landing-solution-layout">
          <div className="landing-solution-hero">
            <LandingReveal className="text-left">
              <h2 id="landing-solution-title" className="landing-section-title">
                De la incertidumbre a la claridad.
              </h2>
              <p className="landing-section-lead mt-6 max-w-none lg:mt-7">
                El cambio no es complicado. Es saber cuánto cuesta lo que produces y decidir con esa
                información.
              </p>
            </LandingReveal>

            <LandingReveal delay={40} className="overflow-visible">
              <SolutionScreenshot />
            </LandingReveal>
          </div>

          <LandingReveal delay={80}>
            <div className="landing-solution-transforms" role="list">
              {TRANSFORMATIONS.map((item, index) => (
                <TransformRow key={item.after} item={item} showDivider={index > 0} />
              ))}
            </div>
          </LandingReveal>
        </div>
      </div>
    </section>
  );
};
