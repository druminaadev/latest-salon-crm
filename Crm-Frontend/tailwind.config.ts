import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        salon: {
          50:  '#F9EEF4',
          100: '#D88385',
          200: '#C96F9B',
          400: '#9D679F',
          600: '#6F5AA3',
          900: '#4C3A76',
        },
        support: {
          sage: '#6F9F8F',
          gold: '#C7923E',
          sky: '#6D91BF',
          plum: '#5F4C86',
        },
      },
      ringColor: {
        salon: '#9D679F',
      },
    },
  },
  plugins: [],
}
export default config
