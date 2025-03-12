/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        // Primary colors - Material Design 3 palette
        primary: {
          50: '#eefbff',
          100: '#dcf7ff',
          200: '#b8eeff',
          300: '#94e6ff',
          400: '#70ddfe',
          500: '#4cd3fc',
          600: '#39b3ed',
          700: '#288dce',
          800: '#2372a9',
          900: '#225e89',
          950: '#173d5c',
        },
        // Secondary colors - Material Design 3 palette
        secondary: {
          50: '#f4f1ff',
          100: '#ede5ff',
          200: '#d9caff',
          300: '#beaaff',
          400: '#a182ff',
          500: '#8a63fc',
          600: '#7344ef',
          700: '#6132d1',
          800: '#512baa',
          900: '#452789',
          950: '#281566',
        },
        // Tertiary colors - Material Design 3 tertiary palette
        tertiary: {
          50: '#f6f9ef',
          100: '#ebf3dc',
          200: '#d7e6bc',
          300: '#bbd594',
          400: '#9ebe6a',
          500: '#7fa146',
          600: '#658339',
          700: '#4f6630',
          800: '#3e502a',
          900: '#344325',
          950: '#1a2412',
        },
        // Status colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#2CB67D',
          600: '#209064',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Surface and background colors for light and dark modes
        surface: {
          light: '#FFFFFF',
          lightElevated: '#F8F9FC',
          lightDepressed: '#EDF0F7',
          dark: '#1A1A2A',
          darkElevated: '#25253A',
          darkDepressed: '#12121E',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'blockquote p:first-of-type::before': {
              content: '""',
            },
            'blockquote p:last-of-type::after': {
              content: '""',
            },
            maxWidth: '65ch', // Optimal measure (65 characters per line)
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
              textDecoration: 'none',
              borderBottom: `1px solid ${theme('colors.primary.300')}`,
              transition: 'color 0.2s ease, border-color 0.2s ease',
              '&:hover': {
                borderColor: theme('colors.primary.500'),
              },
            },
            h1: {
              fontWeight: '700',
              fontSize: theme('fontSize.4xl'),
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.6'),
              lineHeight: '1.1',
              letterSpacing: '-0.01em',
            },
            h2: {
              fontWeight: '700',
              fontSize: theme('fontSize.3xl'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
              lineHeight: '1.2',
              letterSpacing: '-0.01em',
            },
            h3: {
              fontWeight: '700',
              fontSize: theme('fontSize.2xl'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.3'),
              lineHeight: '1.3',
            },
            h4: {
              fontWeight: '700',
              fontSize: theme('fontSize.xl'),
              lineHeight: '1.4',
            },
            p: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
              lineHeight: '1.65', // Improved readability
            },
            strong: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200'),
              overflowX: 'auto',
              fontSize: theme('fontSize.sm'),
              padding: theme('spacing.6'),
              borderRadius: theme('borderRadius.lg'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: theme('fontFamily.mono'),
              lineHeight: 'inherit',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.800'),
              padding: theme('spacing.1'),
              borderRadius: theme('borderRadius.sm'),
              fontWeight: '500',
              fontSize: theme('fontSize.sm'),
            },
            'ol li:before': {
              color: theme('colors.primary.600'),
              fontWeight: '600',
            },
            'ul li:before': {
              backgroundColor: theme('colors.primary.600'),
            },
            hr: {
              borderColor: theme('colors.gray.200'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              borderBottom: `1px solid ${theme('colors.primary.700')}`,
              '&:hover': {
                color: theme('colors.primary.300'),
                borderColor: theme('colors.primary.500'),
              },
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.300'),
            },
            blockquote: {
              borderColor: theme('colors.gray.700'),
              color: theme('colors.gray.300'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            'ol li:before': {
              color: theme('colors.primary.400'),
            },
            'ul li:before': {
              backgroundColor: theme('colors.primary.400'),
            },
          },
        },
      }),
      // Custom shadows for neumorphism
      boxShadow: {
        'neu-flat': 'none',
        
        // Light theme neumorphic shadows
        'neu-raised-light': '8px 8px 16px rgba(174, 174, 192, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9)',
        'neu-pressed-light': 'inset 4px 4px 8px rgba(174, 174, 192, 0.2), inset -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neu-concave-light': 'inset 8px 8px 16px rgba(255, 255, 255, 0.8), inset -8px -8px 16px rgba(174, 174, 192, 0.2)',
        'neu-convex-light': 'inset -8px -8px 16px rgba(255, 255, 255, 0.9), inset 8px 8px 16px rgba(174, 174, 192, 0.2)',
        
        // Dark theme neumorphic shadows
        'neu-raised-dark': '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(67, 67, 92, 0.3)',
        'neu-pressed-dark': 'inset 4px 4px 8px rgba(0, 0, 0, 0.7), inset -4px -4px 8px rgba(67, 67, 92, 0.2)',
        'neu-concave-dark': 'inset 8px 8px 16px rgba(67, 67, 92, 0.3), inset -8px -8px 16px rgba(0, 0, 0, 0.5)',
        'neu-convex-dark': 'inset -8px -8px 16px rgba(67, 67, 92, 0.3), inset 8px 8px 16px rgba(0, 0, 0, 0.5)',
        
        // Material Design shadows
        'soft': '0 3px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
      // Animation utilities for Material Design motion
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      // Custom grid settings for the fluid grid system
      gridTemplateColumns: {
        'auto-fill-card': 'repeat(auto-fill, minmax(280px, 1fr))',
        'auto-fill-sm': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-md': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fill-lg': 'repeat(auto-fill, minmax(360px, 1fr))',
      },
      // Custom border radius values
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // For focus accessibility
      outline: {
        'primary': ['2px solid #4cd3fc', '2px'],
      },
      outlineColor: {
        primary: '#3b82f6', // Using blue-500 as an example, change to your primary color
      },
    },
  },
  // Enable the plugins that are needed
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes when using the class strategy
    }),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
}
