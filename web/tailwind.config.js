/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mako: {
          blue: '#0066FF',     // Mako Electric Blue (from logo)
          darkBlue: '#0A2540', // Deep Navy for text/accents
          cyan: '#00A3FF',     // Vivid sky/cyan
          dark: '#0B0F19',     // Pure black/dark for typography
          card: '#FFFFFF',     // Clean white
          subtle: '#F8FAFC',   // Light slate background
          border: '#E2E8F0',   // Clean light border
          borderHover: '#CBD5E1',
          emerald: '#059669',
          rose: '#E11D48'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
};
