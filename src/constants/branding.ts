export const BRANDING_VERSION = '20260703174500';

/** Fondo sólido del isotipo y logos oscuros */
export const BRAND_BACKGROUND = '#0D1B2A';

export const BRAND_WORDMARK = {
  brew: '#0D1B2A',
  brewOnDark: '#FFFFFF',
  control: '#F5A623',
  fontSize: 24,
  fontWeight: 700,
  iconSize: 40,
  gap: 12,
  sidebarPaddingX: 24,
} as const;

const brandingAsset = (filename: string) =>
  `/branding/${filename}?v=${BRANDING_VERSION}`;

export const BRANDING_PATHS = {
  logoHorizontal: {
    light: brandingAsset('logo-horizontal-claro.png'),
    dark: brandingAsset('logo-horizontal-oscuro.png'),
  },
  logoShort: {
    light: brandingAsset('logo-corto-claro.png'),
    dark: brandingAsset('logo-corto-oscuro.png'),
  },
  icon: {
    light: brandingAsset('icono-claro.png'),
    dark: brandingAsset('icono-dark.png'),
  },
  iconTransparent: {
    light: brandingAsset('icono-claro-transparent.png'),
    dark: brandingAsset('icono-dark-transparent.png'),
  },
} as const;

export type BrandingTheme = 'light' | 'dark';
