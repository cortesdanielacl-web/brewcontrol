import React from 'react';
import { LandingBenefits } from './LandingBenefits';
import { LandingCTA } from './LandingCTA';
import { LandingFooter } from './LandingFooter';
import { LandingHero } from './LandingHero';
import { LandingManifesto } from './LandingManifesto';
import { LandingNavbar } from './LandingNavbar';
import { LandingProblem } from './LandingProblem';
import { LandingSolution } from './LandingSolution';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bc-gray-light text-bc-navy">
      <LandingNavbar />

      <main>
        <LandingHero />
        <LandingProblem />
        <LandingSolution />
        <LandingBenefits />
        <LandingManifesto />
        <LandingCTA />
      </main>

      <LandingFooter />
    </div>
  );
};
