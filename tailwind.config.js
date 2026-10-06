/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
          accent: '#00f5ff',
          neon: '#ec4899',
          gold: '#fbbf24',
          emerald: '#10b981',
        },
        dark: {
          950: '#06070c',
          900: '#0b0d14',
          850: '#10131d',
          800: '#141824',
          750: '#1a1f30',
          700: '#22283d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        minecraft: ['Minecraftia', 'VT323', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(139, 92, 246, 0.3)',
        'glow-md': '0 0 25px -3px rgba(139, 92, 246, 0.45)',
        'glow-lg': '0 0 45px -5px rgba(139, 92, 246, 0.6)',
        'glow-cyan': '0 0 35px -5px rgba(0, 245, 255, 0.5)',
        'glow-gold': '0 0 35px -5px rgba(251, 191, 36, 0.5)',
        'glow-ruby': '0 0 35px -5px rgba(244, 63, 94, 0.5)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.5))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(0,245,255,0.8))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
