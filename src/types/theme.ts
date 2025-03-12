export type ThemeMode = 'light' | 'dark' | 'system';
export type AnimationPreference = 'full' | 'reduced' | 'none';
export type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ColorScheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type Padding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type Shadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
export type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type Overflow = 'visible' | 'hidden' | 'scroll' | 'auto';
export type Display = 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none';

export interface ThemeContextType {
  theme: string;
  themeMode: ThemeMode; 
  animationPreference: AnimationPreference;
  setThemeMode: (mode: ThemeMode) => void;
  setAnimationPreference: (pref: AnimationPreference) => void;
  toggleTheme: () => void;
  isDark: boolean;
  accentColor: string;
  secondaryAccentColor: string;
}

export interface ColorSchemeObject {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ThemeColors {
  primary: ColorSchemeObject;
  secondary: ColorSchemeObject;
  success: ColorSchemeObject;
  warning: ColorSchemeObject;
  error: ColorSchemeObject;
}

export interface ThemeConfig {
  breakpoints: Record<BreakpointType, number>;
  fontSizes: Record<string, string>;
  lineHeights: Record<string, string>;
  fontFamilies: Record<FontFamily, string>;
  typeScale: {
    small: Record<string, string>;
    base: Record<string, string>;
    large: Record<string, string>;
  };
  animation: {
    fast: string;
    normal: string;
    slow: string;
    easing: {
      default: string;
      in: string;
      out: string;
      inOut: string;
    };
  };
  zIndex: Record<string, number>;
  spacing: Record<string | number, string>;
  lightTheme: {
    background: Record<string, string>;
    text: Record<string, string>;
    border: Record<string, string>;
  };
  darkTheme: {
    background: Record<string, string>;
    text: Record<string, string>;
    border: Record<string, string>;
  };
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
} 