import React from 'react';
import { LANDING_PHOTOS } from '../../constants/landingAssets';
import { LandingPhoto } from './LandingPhoto';

interface LandingResultPhotoProps {
  className?: string;
}

/**
 * Fotografía de resultado final — `LANDING_PHOTOS.finalResult`.
 */
export const LandingResultPhoto: React.FC<LandingResultPhotoProps> = ({
  className = 'aspect-[4/3] w-full sm:aspect-[3/2]',
}) => (
  <div className={`landing-photo-frame ${className}`}>
    <LandingPhoto
      variant="result"
      src={LANDING_PHOTOS.finalResult}
      alt="Resultado final de la cervecería artesanal"
      className="h-full w-full"
    />
  </div>
);
