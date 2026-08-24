/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#091F44',
          'navy-deep': '#071736',
          'blue-deep': '#0D3B85',
          blue: '#1B6FC9',
          'blue-soft': '#EAF2FB',
          green: '#7CB342',
          'green-deep': '#4E7525',
          'green-soft': '#F1F7E8',
        },
        ink: '#111111',
        muted: '#6B6E68',
        surface: {
          0: '#FFFFFF',
          1: '#FAFAF9',
          2: '#F3F4F1',
        },
        hairline: '#EBEBE7',
        strong: '#DCDDD8',
        border: {
          hairline: '#EBEBE7',
          strong: '#DCDDD8',
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Clash Display', 'Satoshi', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '8px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(9, 31, 68, 0.06)',
        lift: '0 12px 32px -12px rgba(9, 31, 68, 0.18)',
        panel: '0 24px 64px -24px rgba(9, 31, 68, 0.28)',
      },
    },
  },
  plugins: [],
};
