import React from 'react';
import { CircleDollarSign, Clock, Files, TrendingUp, type LucideIcon } from 'lucide-react';
import { LANDING_PHOTOS } from '../../constants/landingAssets';
import { LandingPhoto } from './LandingPhoto';
import { LandingReveal } from './LandingReveal';

interface ProblemItem {
  icon: LucideIcon;
  text: string;
}

type ProblemTone = 'warm' | 'cool';

const PROBLEM_TONE_CLASSES: Record<
  ProblemTone,
  { circle: string; icon: string }
> = {
  warm: {
    circle: 'border-bc-copper/20 bg-bc-copper/[0.08]',
    icon: 'text-bc-copper',
  },
  cool: {
    circle: 'border-bc-action/18 bg-bc-action/[0.07]',
    icon: 'text-bc-action',
  },
};

const PROBLEM_ITEMS: ProblemItem[] = [
  {
    icon: CircleDollarSign,
    text: 'No conoces el costo real de cada receta.',
  },
  {
    icon: Files,
    text: 'Tus recetas terminan repartidas entre planillas, cuadernos y archivos.',
  },
  {
    icon: TrendingUp,
    text: 'Fijas precios con aproximaciones en lugar de datos reales.',
  },
  {
    icon: Clock,
    text: 'Pierdes horas en cálculos manuales que nunca te dan la respuesta completa.',
  },
];

const PROBLEM_TONES: ProblemTone[] = ['warm', 'cool', 'warm', 'cool'];

const ProblemBlock: React.FC<ProblemItem & { tone: ProblemTone }> = ({
  icon: Icon,
  text,
  tone,
}) => {
  const toneClasses = PROBLEM_TONE_CLASSES[tone];

  return (
    <article className="flex min-h-[7.5rem] flex-col items-center justify-center gap-6 px-3 py-4 text-center sm:min-h-[8rem] sm:gap-7 sm:py-5 lg:px-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-transform duration-250 hover:scale-105 ${toneClasses.circle}`}
      >
        <Icon className={`h-7 w-7 ${toneClasses.icon}`} strokeWidth={2} aria-hidden />
      </div>
      <p className="w-full max-w-[17rem] text-sm font-medium leading-[1.62] text-bc-navy sm:max-w-[18rem] sm:text-base sm:leading-[1.65] lg:max-w-none">
        {text}
      </p>
    </article>
  );
};

export const LandingProblem: React.FC = () => {
  return (
    <section aria-labelledby="landing-problem-title" className="relative bg-white">
      <div className="landing-section-divider" aria-hidden />

      <div className="landing-container landing-section">
        <div className="landing-section-stack landing-section-stack--lg mx-auto w-full">
          <div className="flex flex-col gap-8 sm:gap-9 lg:gap-12">
            <LandingReveal className="landing-problem-intro text-center">
              <h2 id="landing-problem-title" className="landing-section-title">
                Hacer una buena cerveza no siempre significa tener un buen negocio.
              </h2>
            </LandingReveal>

            <LandingReveal delay={40}>
              <div className="landing-problem-media">
                <div className="landing-photo-frame landing-photo-frame--problem overflow-hidden border border-bc-border bg-white">
                  <div className="px-6 py-2 text-center sm:px-8 sm:py-3 lg:px-10 lg:py-4">
                    <p className="landing-section-lead mx-auto">
                      Muchos productores elaboran{' '}
                      <span className="font-semibold text-bc-navy">excelentes recetas</span>, pero siguen
                      tomando decisiones sin conocer el{' '}
                      <span className="font-semibold text-bc-yellow">costo real de producción</span>.
                    </p>
                  </div>

                  <LandingPhoto
                    variant="problem"
                    src={LANDING_PHOTOS.notebookCalculations}
                    alt="Libreta con cálculos manuales de costos cerveceros"
                    className="[&_.landing-photo]:h-auto [&_.landing-photo]:min-h-0 [&_.landing-photo]:rounded-none [&_.landing-photo__img]:h-auto [&_.landing-photo__img]:object-contain"
                  />
                </div>
              </div>
            </LandingReveal>
          </div>

          <div className="landing-problem-benefits grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-6">
            {PROBLEM_ITEMS.map((item, index) => (
              <LandingReveal key={item.text} delay={60 + index * 40}>
                <ProblemBlock icon={item.icon} text={item.text} tone={PROBLEM_TONES[index]} />
              </LandingReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
