/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',  // Added this line for class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}