/**
 * CONSTANTES DE THÈME & DESIGN SYSTEM (theme.js)
 * 
 * Centralise les couleurs (Fond Jaune Pur & Accents), typographies,
 * espacements, bordures et ombres pour l'application Web PWA.
 */

export const theme = {
  // 1. PALETTE DE COULEURS
  colors: {
    // Teintes Primaires
    primary: '#1E3A8A',
    primaryLight: '#3B82F6',
    primaryDark: '#0F172A',
    primarySubtle: 'rgba(59, 130, 246, 0.12)',

    // Teintes Secondaires (Or & Ambre)
    secondary: '#D97706',
    secondaryLight: '#F59E0B',
    secondaryDark: '#B45309',
    secondarySubtle: 'rgba(245, 158, 11, 0.15)',

    // Fonds & Surfaces (Fond Jaune Pur Vibrant)
    background: '#FFE600',
    backgroundPureYellow: '#FFFF00',
    backgroundCard: '#0F172A',
    backgroundSurface: '#1E293B',
    backgroundInput: '#0B1120',
    backgroundOverlay: 'rgba(15, 23, 42, 0.85)',

    // Textes & Typographie
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textAccent: '#38BDF8',
    textDark: '#0F172A',

    // Statuts & Indicateurs Métier
    statusSuccess: '#10B981',
    statusSuccessSubtle: 'rgba(16, 185, 129, 0.15)',
    statusWarning: '#F59E0B',
    statusWarningSubtle: 'rgba(245, 158, 11, 0.15)',
    statusDanger: '#EF4444',
    statusDangerSubtle: 'rgba(239, 68, 68, 0.15)',
    statusInfo: '#06B6D4',
    statusInfoSubtle: 'rgba(6, 182, 212, 0.15)',

    // Bordures & Séparateurs
    borderLight: '#1E293B',
    borderMedium: '#334155',
    borderFocus: '#60A5FA',
    borderDanger: '#F87171',

    white: '#FFFFFF',
    transparent: 'transparent'
  },

  // 2. ÉCHELLE TYPOGRAPHIQUE
  typography: {
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '1.75rem',
      display: '2.125rem',
      hero: '2.625rem'
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },

  // 3. ESPACEMENTS NORMALISÉS
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    base: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
    xxxl: '3rem'
  },

  // 4. RAYONS DE BORDURE
  radii: {
    xs: '4px',
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '9999px'
  },

  // 5. POINTS DE RUPTURE RESPONSIVE (BREAKPOINTS)
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1280
  }
};

export default theme;
