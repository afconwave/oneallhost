/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          'blue-deep': '#0D3B85',
          'blue': '#1B6FC9',
          'green': '#7CB342',
        },
        ink: '#111111',
        surface: {
          0: '#FFFFFF',
          1: '#FAFAF9',
          2: '#F3F4F1',
        },
        border: {
          hairline: '#EBEBE7',
          strong: '#DCDDD8',
        },
        muted: '#6B6E68',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '8px',
      },
    },
  },
  plugins: [],
};
