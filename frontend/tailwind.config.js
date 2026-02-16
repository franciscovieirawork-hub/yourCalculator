/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6f8',
          100: '#d5eaef',
          200: '#b0dae3',
          300: '#7bc2d2',
          400: '#45a2b9',
          500: '#29869e',
          600: '#246b83',
          700: '#23576c',
          800: '#24495a',
          900: '#213d4c',
          950: '#102833',
        },
        bank: {
          navy: '#0d2137',
          teal: '#006b5a',
          gold: '#c4a35a',
          silver: '#8b9cad',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(13, 33, 55, 0.08)',
        header: '0 2px 12px rgba(13, 33, 55, 0.06)',
      },
    },
  },
  plugins: [],
};
