/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Central Design Tokens */
        action: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-border': 'var(--color-primary-border)',
          'primary-text': 'var(--color-primary-text)',
          secondary: 'var(--color-secondary)',
          'secondary-hover': 'var(--color-secondary-hover)',
          'secondary-border': 'var(--color-secondary-border)',
          'secondary-text': 'var(--color-secondary-text)',
        },
        token: {
          bg: 'var(--color-background)',
          surface: 'var(--color-surface)',
          'text-main': 'var(--color-text-main)',
          'text-muted': 'var(--color-text-muted)',
          'brand-blue': 'var(--color-brand-blue)',
          'brand-navy': 'var(--color-brand-navy)',
        },
        pagehero: {
          from: 'var(--module-hero-from)',
          via: 'var(--module-hero-via)',
          to: 'var(--module-hero-to)',
          'overlay-from': 'var(--module-hero-overlay-from)',
          'overlay-via': 'var(--module-hero-overlay-via)',
          'overlay-to': 'var(--module-hero-overlay-to)',
        },
        brand: {
          blue: '#134e8f',
          azure: '#134e8f',
          navy: '#0f233a',
          midnight: '#0f233a',
          coral: '#eb4e52',
          ice: '#e8f2fb',
          frostBorder: '#c0dbf1',
          charcoal: '#0f233a',
          accent: '#134e8f',
          gray: '#f8f9fa',
          steel: '#64748b',
          muted: '#e8f2fb',
          hero: {
            from: '#d9ebfa',
            via: '#e8f2fb',
            to: '#cfe4f6',
            overlay: '#e8f2fb',
          },
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
