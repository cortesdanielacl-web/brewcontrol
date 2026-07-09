import React from 'react';

import { LandingReveal } from './LandingReveal';



const highlightWhite = 'text-[1.06em] font-bold text-white';



export const LandingManifesto: React.FC = () => {

  return (

    <section aria-labelledby="landing-manifesto-title" className="relative bg-bc-navy">

      <div className="landing-container landing-section landing-section--manifesto">

        <div className="landing-manifesto-copy">

          <LandingReveal className="flex w-full flex-col items-center text-center">

            <h2

              id="landing-manifesto-title"

              className="flex w-full flex-col items-center text-center"

            >

              <span className="landing-manifesto-brand text-white" translate="no">BrewControl</span>

              <span className="landing-section-title landing-manifesto-title text-white sm:text-[2.75rem] lg:text-[3rem]">

                no nació para calcular costos.

              </span>

            </h2>

          </LandingReveal>



          <LandingReveal

            delay={40}

            className="landing-manifesto-body w-full space-y-6 text-center text-lg leading-relaxed text-white/90 sm:space-y-7 sm:text-xl sm:leading-relaxed"

          >

            <p>

              Nació para ayudar a que más{' '}

              <span className="whitespace-nowrap">cervecerías artesanales</span> sean{' '}

              <span className={`whitespace-nowrap ${highlightWhite}`}>negocios rentables</span>.

            </p>



            <p>

              Creemos que detrás de cada cerveza hay tiempo, esfuerzo,{' '}

              <span className="whitespace-nowrap">aprendizaje y</span>{' '}

              <span className={highlightWhite}>pasión</span>.

            </p>



            <p>

              También creemos que todo ese trabajo merece transformarse en un{' '}

              <span className={`whitespace-nowrap ${highlightWhite}`}>negocio sostenible</span>.

            </p>

          </LandingReveal>



          <LandingReveal delay={80} className="flex w-full flex-col items-center text-center">

            <div className="landing-manifesto-divider" aria-hidden />

            <p className="landing-manifesto-closing font-extrabold text-bc-yellow">

              <span className="block whitespace-nowrap">Porque una buena cerveza</span>

              <span className="block whitespace-nowrap">merece un buen negocio.</span>

            </p>

          </LandingReveal>

        </div>

      </div>

    </section>

  );

};


