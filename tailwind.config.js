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
        display: ['Syne', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#F97316',
          light: '#FFF0E6',
          dark: '#EA6608',
        },
        surface: {
          DEFAULT: '#F4F5FA',
          card: '#FFFFFF',
          dark: '#0F1117',
          'card-dark': '#1A1D26',
          'border-dark': '#2A2D38',
        },
        ink: {
          DEFAULT: '#1A1C2E',
          muted: '#6B7085',
          light: '#A0A6BE',
        },
        income: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          dark: '#059669',
        },
        expense: {
          DEFAULT: '#EF4444',
          light: '#FEF2F2',
          dark: '#DC2626',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.07)',
        'accent': '0 4px 14px rgba(249, 115, 22, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'scale-in': 'scaleIn 0.2s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
