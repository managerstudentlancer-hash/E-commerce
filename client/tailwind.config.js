/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A0A0A',
          primary: '#111111',
          subtext: '#666666',
          border: '#E5E5E5',
          background: '#FFFFFF',
          sale: '#C4301C',
          badgeNew: '#0D8756',
          badgeHot: '#7188ED',
          pastelYellow: '#F4F691',
          warmButter: '#FFE093',
          cream: '#FAF9F6',
          surface: '#F6F6F6',
        },
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        pill: '100px',
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(0, 0, 0, 0.04)',
        card: '0 4px 20px rgba(0, 0, 0, 0.06)',
        drawer: '-10px 0 30px rgba(0, 0, 0, 0.15)',
        dropdown: '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
