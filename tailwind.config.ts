import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hostlixo: {
          purple: '#ef4444', // Replaced with red
          'purple-dark': '#b91c1c',
          'purple-deep': '#7f1d1d',
          cyan: '#f43f5e', // Replaced with rose
          'cyan-dark': '#e11d48',
          blue: '#ef4444',
          bg: '#050505', // Deep black
          'bg-light': '#0a0a0a',
          panel: '#121212',
        }
      },
      fontFamily: {
        heading: ['var(--font-orbitron)', 'sans-serif'],
        body: ['var(--font-quicksand)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
