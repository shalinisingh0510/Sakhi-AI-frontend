import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F2',
        blush: '#F7D7C4',
        rose: '#D97D54',
        berry: '#7B3F3A',
        ink: '#1E2A39',
        moss: '#5A7A66',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(30, 42, 57, 0.16)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top left, rgba(247, 215, 196, 0.8), transparent 40%), radial-gradient(circle at top right, rgba(122, 63, 58, 0.18), transparent 35%), linear-gradient(180deg, #FFF8F2 0%, #FFFDF9 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
