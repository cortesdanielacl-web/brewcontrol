import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LANDING_PHOTOS, LANDING_SCREENSHOTS, toWebpSrc } from '../../constants/landingAssets';
import { LandingPhoto } from './LandingPhoto';
import { LandingReveal } from './LandingReveal';

interface ShowcaseSlide {
  title: string;
  description: string;
  screenshot: (typeof LANDING_SCREENSHOTS)[keyof typeof LANDING_SCREENSHOTS];
  alt: string;
}

const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    title: 'Todo el costo de tu receta, en un solo lugar.',
    description:
      'Visualiza el costo total de la receta, el costo por barril, el margen y el precio sugerido desde un solo lugar.',
    screenshot: LANDING_SCREENSHOTS.dashboard,
    alt: 'Captura del dashboard de BrewControl mostrando costos de la receta',
  },
  {
    title: 'Evalúa tus recetas con información real.',
    description:
      'Cada ingrediente, cada proceso y cada costo se integran para calcular el valor real de producción.',
    screenshot: LANDING_SCREENSHOTS.evaluation,
    alt: 'Captura de la evaluación de receta en BrewControl',
  },
  {
    title: 'Compara y mejora cada evaluación.',
    description:
      'Consulta evaluaciones anteriores, analiza resultados y toma mejores decisiones para tus próximas recetas.',
    screenshot: LANDING_SCREENSHOTS.history,
    alt: 'Captura del historial de evaluaciones en BrewControl',
  },
];

const SLIDE_COUNT = SHOWCASE_SLIDES.length;
const AUTOPLAY_MS = 6000;
const SLIDE_TRANSITION_MS = 280;

const slideTransitionStyle = {
  transition: `transform ${SLIDE_TRANSITION_MS}ms ease-in-out`,
} as const;

function getSlideOffset(index: number, activeIndex: number): string {
  if (index === activeIndex) return 'translate-x-0';

  const forward = (index - activeIndex + SLIDE_COUNT) % SLIDE_COUNT;
  const backward = (activeIndex - index + SLIDE_COUNT) % SLIDE_COUNT;

  return forward < backward ? 'translate-x-full' : '-translate-x-full';
}

const ProductionHero: React.FC = () => (
  <div className="landing-photo-frame landing-media-frame relative aspect-[16/10] w-full">
    <LandingPhoto
      variant="production"
      src={LANDING_PHOTOS.production}
      alt="Cervecero agregando lúpulo en la olla de cocción"
      className="h-full w-full"
    />

    <div
      className="landing-production-read-zone pointer-events-none absolute inset-0"
      aria-hidden
    />

    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-[45px] top-[14%] max-w-[25rem] -translate-y-[70px] sm:top-[15%] lg:top-[16%]">
        <h2 id="landing-production-title" className="landing-hero-title !text-left text-white">
          Produce con tranquilidad.
        </h2>
        <p className="mt-6 max-w-none text-lg leading-[1.625] text-white/90 lg:text-xl [text-shadow:0_1px_10px_rgba(13,27,42,0.35)]">
          <span translate="no">BrewControl</span> se ocupa de los costos.
          <br />
          <span className="font-semibold text-[#FFFFFF]">Tú dedícate a tu pasión.</span>
        </p>
      </div>
    </div>
  </div>
);

const ShowcaseCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayActive, setAutoplayActive] = useState(true);
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});
  const [failedSlides, setFailedSlides] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const stopAutoplay = useCallback(() => {
    setAutoplayActive(false);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      stopAutoplay();
      setActiveIndex((index + SLIDE_COUNT) % SLIDE_COUNT);
    },
    [stopAutoplay],
  );

  const goNext = useCallback(() => {
    stopAutoplay();
    setActiveIndex((current) => (current + 1) % SLIDE_COUNT);
  }, [stopAutoplay]);

  const goPrev = useCallback(() => {
    stopAutoplay();
    setActiveIndex((current) => (current - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, [stopAutoplay]);

  useEffect(() => {
    if (!autoplayActive) return;

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDE_COUNT);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timerId);
  }, [autoplayActive, activeIndex]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    stopAutoplay();
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;
    if (touchEndX === undefined) return;

    const delta = touchEndX - touchStartX.current;
    if (Math.abs(delta) >= 48) {
      if (delta > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    touchStartX.current = null;
  };

  return (
    <div
      className="landing-showcase w-full"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Capturas de BrewControl"
    >
      <div className="group relative w-full">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Captura anterior"
          className="landing-showcase-arrow absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-bc-border bg-white p-3 text-bc-navy shadow-md backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bc-action lg:flex"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </button>

        <div
          className="landing-screenshot-stage landing-screenshot-stage--showcase touch-pan-y overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {SHOWCASE_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={slide.title}
                aria-hidden={!isActive}
                className={`absolute inset-0 w-full will-change-transform ${getSlideOffset(index, activeIndex)} ${
                  isActive ? 'z-[1]' : 'pointer-events-none z-0'
                }`}
                style={slideTransitionStyle}
              >
                <div className="landing-screenshot-frame landing-screenshot-frame--showcase flex h-full items-start justify-center overflow-hidden">
                  {failedSlides[index] ? (
                    <div className="flex h-full w-full items-center justify-center bg-bc-gray-light px-6 text-sm font-medium text-bc-muted">
                      Captura no disponible
                    </div>
                  ) : (
                    <picture>
                      <source srcSet={toWebpSrc(slide.screenshot)} type="image/webp" />
                      <img
                        src={slide.screenshot}
                        alt={slide.alt}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        onLoad={() =>
                          setLoadedSlides((current) => ({ ...current, [index]: true }))
                        }
                        onError={() =>
                          setFailedSlides((current) => ({ ...current, [index]: true }))
                        }
                        className={`block h-full w-full object-contain object-top transition-opacity duration-[280ms] ${
                          loadedSlides[index] ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </picture>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Captura siguiente"
          className="landing-showcase-arrow absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 rounded-full border border-bc-border bg-white p-3 text-bc-navy shadow-md backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bc-action lg:flex"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </button>
      </div>

      <div className="landing-showcase-caption relative mt-10 min-h-[7.5rem] w-full overflow-hidden sm:mt-11">
        {SHOWCASE_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.title}
              aria-hidden={!isActive}
              className={`flex w-full flex-col items-center text-center will-change-transform ${getSlideOffset(index, activeIndex)} ${
                isActive ? 'relative z-[1]' : 'pointer-events-none absolute inset-x-0 top-0 z-0'
              }`}
              style={slideTransitionStyle}
            >
              <h3 className="landing-showcase-caption-title">{slide.title}</h3>
              <p className="landing-section-lead mx-auto mt-4 max-w-[38rem] text-bc-text-secondary">
                {slide.description}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="landing-showcase-nav mt-6 flex items-center justify-center gap-3 sm:mt-7"
        role="tablist"
        aria-label="Seleccionar captura"
      >
        {SHOWCASE_SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Ver ${slide.title}`}
            onClick={() => goTo(index)}
            className={`h-2.5 rounded-full transition-all duration-250 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bc-action ${
              index === activeIndex
                ? 'w-11 bg-bc-navy'
                : 'w-5 bg-bc-muted/50 hover:bg-bc-muted/70'
            }`}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {SHOWCASE_SLIDES[activeIndex]?.title}: {SHOWCASE_SLIDES[activeIndex]?.description}
      </p>
    </div>
  );
};

export const LandingBenefits: React.FC = () => {
  return (
    <section aria-labelledby="landing-benefits-title" className="relative bg-white">
      <div className="landing-section-divider" aria-hidden />

      <div className="landing-container landing-section">
        <div className="landing-section-stack landing-section-stack--lg landing-section-stack--benefits">
          <LandingReveal>
            <ProductionHero />
          </LandingReveal>

          <LandingReveal className="w-full">
            <div className="landing-showcase-intro flex flex-col items-center text-center">
              <h2 id="landing-benefits-title" className="landing-section-title">
                Así se ve cuando tienes claridad.
              </h2>
              <p className="landing-section-lead mx-auto mt-4 max-w-[38rem] sm:mt-5">
                Descubre cómo <span translate="no">BrewControl</span> te ayuda a tomar mejores decisiones.
              </p>

              <div className="landing-showcase-wrap mt-10 w-full sm:mt-11 lg:mt-14">
                <ShowcaseCarousel />
              </div>
            </div>
          </LandingReveal>
        </div>
      </div>
    </section>
  );
};
