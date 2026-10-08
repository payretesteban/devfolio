import { fileURLToPath } from 'url';
import typography from '@tailwindcss/typography';

const componentsDir = fileURLToPath(new URL('./components', import.meta.url));
const templatesDir = fileURLToPath(new URL('./templates', import.meta.url));

// Colors resolve to CSS variables that base.hubl.html generates from theme
// fields, so the theme editor can re-skin every Tailwind utility at once.
const themeColor = (name) => `rgb(var(--df-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    `${componentsDir}/**/*.{js,ts,jsx,tsx}`,
    `${templatesDir}/**/*.html`,
  ],
  theme: {
    extend: {
      colors: {
        accent: themeColor('accent'),
        'accent-alt': themeColor('accent-alt'),
        success: themeColor('success'),
        bg: themeColor('bg'),
        surface: themeColor('surface'),
        ink: themeColor('text'),
        muted: themeColor('muted'),
        line: 'rgb(255 255 255 / 0.08)',
        'line-strong': 'rgb(255 255 255 / 0.16)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        theme: 'var(--df-radius)',
      },
      maxWidth: {
        site: '1180px',
      },
      backgroundImage: {
        brand: 'linear-gradient(120deg, rgb(var(--df-accent)), rgb(var(--df-accent-alt)))',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        blink: 'blink 1s step-end infinite',
        'fade-up': 'fade-up .5s ease-out both',
      },
    },
  },
  plugins: [typography],
};
