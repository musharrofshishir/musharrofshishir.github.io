export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#0A0A0A',
        surface: '#111111',
        'surface-light': '#1A1A1A',
        'surface-hover': '#222222',
        accent: '#C8A96E',
        'accent-light': '#D4BA85',
        muted: '#666666',
        'text-primary': '#F5F5F0',
        'text-secondary': '#999999',
      },
      fontFamily: {
        serif: ['"Canela"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'heading': ['clamp(2rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'subheading': ['clamp(1.25rem, 2.5vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [],
}
