/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',  // Added this line for class-based dark mode
  theme: {
    extend: {
      colors: {
        heading: '#1a202c', // Light theme heading color
        paragraph: '#4a5568', // Light theme paragraph color
        'heading-dark': '#e2e8f0', // Dark theme heading color
        'paragraph-dark': '#a0aec0', // Dark theme paragraph color
      },
    },
  },
  plugins: [],
}