import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F5',
        blush: '#FCE3EA',
        peach: '#FFE7D8',
        lavender: '#EEE6FF',
        mint: '#E5F5EF',
        rose: '#D86A8E',
        berry: '#7B3E73',
        moss: '#4E8678',
        ink: '#1F2433',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(31, 36, 51, 0.14)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top left, rgba(252, 227, 234, 0.92), transparent 30%), radial-gradient(circle at top right, rgba(238, 230, 255, 0.85), transparent 28%), radial-gradient(circle at 65% 20%, rgba(229, 245, 239, 0.7), transparent 24%), linear-gradient(180deg, #FFFCFA 0%, #FFF7FB 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
