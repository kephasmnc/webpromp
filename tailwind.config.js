/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Light warm palette
        cream:     '#FAFAF7',   // main app background
        parchment: '#F4F2EB',   // sidebar / aside background
        beige:     '#EDE9E0',   // panel / card background
        sand:      '#D9D4C8',   // borders
        // Accents
        lilac: {
          DEFAULT: '#8B7EC8',
          dim:     '#7468AE',
          soft:    '#EDE9F8',
        },
        sky: {
          DEFAULT: '#4A7FBA',
          soft:    '#E6EEF8',
        },
        // Text
        ink:  '#2C2926',
        mist: '#8C8478',
      },
      animation: {
        'fade-in':    'fadeIn 0.18s ease-out',
        'slide-down': 'slideDown 0.18s ease-out',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                              to: { opacity: '1' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
