import React from 'react';
import { BRANDING_PATHS, BRAND_WORDMARK, BrandingTheme } from '../constants/branding';

type BrandLogoVariant = 'horizontal' | 'short' | 'icon';

interface BrandLogoProps {
  variant: BrandLogoVariant;
  theme: BrandingTheme;
  alt?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant,
  theme,
  alt = 'BrewControl',
  className,
}) => {
  const iconSrc = variant === 'icon'
    ? BRANDING_PATHS.icon[theme]
    : BRANDING_PATHS.iconTransparent[theme];

  if (variant === 'horizontal') {
    return (
      <img
        src={BRANDING_PATHS.logoHorizontal[theme]}
        alt={alt}
        draggable={false}
        className={className}
      />
    );
  }

  if (variant === 'icon') {
    return (
      <img
        src={iconSrc}
        alt={alt}
        draggable={false}
        className={className}
      />
    );
  }

  const brewColor = theme === 'light' ? BRAND_WORDMARK.brew : BRAND_WORDMARK.brewOnDark;

  return (
    <div
      role="img"
      aria-label={alt}
      className={`inline-flex items-center select-none ${className ?? ''}`}
      style={{ gap: BRAND_WORDMARK.gap }}
    >
      <img
        src={iconSrc}
        alt=""
        aria-hidden
        draggable={false}
        className="block shrink-0 object-contain"
        style={{
          width: BRAND_WORDMARK.iconSize,
          height: BRAND_WORDMARK.iconSize,
        }}
      />
      <span
        aria-hidden
        className="whitespace-nowrap leading-none tracking-tight"
        style={{
          fontSize: BRAND_WORDMARK.fontSize,
          fontWeight: BRAND_WORDMARK.fontWeight,
        }}
      >
        <span style={{ color: brewColor }}>Brew</span>
        <span style={{ color: BRAND_WORDMARK.control }}>Control</span>
      </span>
    </div>
  );
};
