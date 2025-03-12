import { BreakpointType } from "@/types/theme";

export const BREAKPOINTS: Record<BreakpointType, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const FONT_SIZES = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px  
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
};

export const LINE_HEIGHTS = {
  none: '1',
  tight: '1.25',
  snug: '1.375', 
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
};

// Space Grotesk for headings, Inter for body text
export const FONT_FAMILIES = {
  sans: 'Inter, "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  serif: 'Merriweather, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
};

// Type scale using a perfect fourth (1.333) ratio
export const TYPE_SCALE = {
  small: {
    h1: FONT_SIZES['3xl'],
    h2: FONT_SIZES['2xl'],
    h3: FONT_SIZES.xl,
    h4: FONT_SIZES.lg,
    body: FONT_SIZES.base,
    small: FONT_SIZES.sm,
  },
  base: {
    h1: FONT_SIZES['4xl'],
    h2: FONT_SIZES['3xl'],
    h3: FONT_SIZES['2xl'],
    h4: FONT_SIZES.xl,
    body: FONT_SIZES.base,
    small: FONT_SIZES.sm,
  },
  large: {
    h1: FONT_SIZES['5xl'],
    h2: FONT_SIZES['4xl'],
    h3: FONT_SIZES['3xl'],
    h4: FONT_SIZES['2xl'],
    body: FONT_SIZES.lg,
    small: FONT_SIZES.base,
  },
};

// Animation timings
export const ANIMATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Z-index system
export const Z_INDEX = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
};

// Spacing system (in rem)
export const SPACING = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
};

// Light theme colors
export const LIGHT_THEME = {
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    disabled: '#9ca3af',
  },
  border: {
    light: '#e5e7eb',
    default: '#d1d5db',
    strong: '#9ca3af',
  },
};

// Dark theme colors
export const DARK_THEME = {
  background: {
    primary: '#111827',
    secondary: '#1f2937',
    tertiary: '#374151',
  },
  text: {
    primary: '#f9fafb',
    secondary: '#e5e7eb',
    tertiary: '#d1d5db',
    disabled: '#9ca3af',
  },
  border: {
    light: '#374151',
    default: '#4b5563',
    strong: '#6b7280',
  },
};

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  none: 'none',
};

// Border radii
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',  // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

export default {
  breakpoints: BREAKPOINTS,
  fontSizes: FONT_SIZES,
  lineHeights: LINE_HEIGHTS,
  fontFamilies: FONT_FAMILIES,
  typeScale: TYPE_SCALE,
  animation: ANIMATION,
  zIndex: Z_INDEX,
  spacing: SPACING,
  lightTheme: LIGHT_THEME,
  darkTheme: DARK_THEME,
  shadows: SHADOWS,
  borderRadius: BORDER_RADIUS,
}; 