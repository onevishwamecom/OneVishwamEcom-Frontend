/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1a4b8c',
          navy: '#0a1f3f',
          charcoal: '#1a1a2e',
          accent: '#2563eb',
          gray: '#f8f9fa',
          steel: '#6b7280',
          muted: '#f0f2f5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
