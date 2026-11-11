/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#f0fdf8',
          100: '#ccfbed',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a'
        },
        ink: '#0c1b1f',
        paper: '#faf8f5',
        accent: '#e879f9'
      },
      boxShadow: {
        card: '0 12px 40px -16px rgba(13, 148, 136, 0.35)'
      }
    }
  },
  plugins: []
}
