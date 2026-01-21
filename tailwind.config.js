/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy colors (keeping for gradual migration)
        'rose-pale': '#F8E8E8',
        'rose-vif': '#E91E63',
        'rose-poudre': '#F48FB1',
        'vert-emeraude': '#00695C',
        'dore': '#FFD700',
        'dore-fonce': '#B8860B',

        // Organic Luxury Design System (NEW)
        primary: {
          DEFAULT: '#D63384', // Rose Diva
          light: '#FDF2F8',   // Rose Pale
          dark: '#A02761',
        },
        secondary: {
          DEFAULT: '#064E3B', // Vert Profond
          light: '#10B981',   // Vert Émeraude
          dark: '#022C22',
        },
        background: {
          DEFAULT: '#FFFFFF',
          pale: '#FDF2F8',
          gray: '#F9FAFB',
        },

        // Previous "Diva" identity (deprecated)
        diva: {
          pink: '#D63384',
          gold: '#C5A059',
          dark: '#1A1A1A',
        }
      },
      fontFamily: {
        'great-vibes': ['Great Vibes', 'cursive'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        // Primary fonts for new system
        'heading': ['Playfair Display', 'serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'chandelier-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23FFD700\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};