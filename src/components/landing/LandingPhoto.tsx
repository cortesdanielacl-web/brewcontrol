import React, { useState } from 'react';
import { toWebpSrc } from '../../constants/landingAssets';

export type LandingPhotoVariant = 'hero' | 'problem' | 'solution' | 'production' | 'result';

interface LandingPhotoProps {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  variant?: LandingPhotoVariant;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const LandingPhoto: React.FC<LandingPhotoProps> = ({
  src,
  alt,
  className = '',
  objectPosition,
  variant,
  priority = false,
  onLoad,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const variantClass = variant ? `landing-photo--${variant}` : '';
  const webpSrc = toWebpSrc(src);

  return (
    <div
      className={`landing-photo ${variantClass} ${failed ? 'landing-photo--fallback' : ''} ${className}`}
    >
      {!failed && (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : undefined}
            onLoad={() => {
              setLoaded(true);
              onLoad?.();
            }}
            onError={() => {
              setFailed(true);
              onError?.();
            }}
            style={objectPosition ? { objectPosition } : undefined}
            className={`landing-photo__img ${loaded ? 'landing-photo__img--loaded' : ''}`}
          />
        </picture>
      )}
    </div>
  );
};
