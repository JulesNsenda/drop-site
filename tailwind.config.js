/** @type {import('tailwindcss').Config} */
export default {
  // Only `@tailwind base` (Tailwind's preflight reset) is used anywhere in
  // this repo — see src/styles/site-reset.css's comment — no utility classes
  // are emitted or referenced, so `content` only needs to point Tailwind at
  // the files that exist here.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
