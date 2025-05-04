/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',  // Added this line for class-based dark mode
  theme: {
    extend: {
      colors: {
        heading: '#1a202c', // Light theme heading color
        paragraph: '#353d4a', // Light theme paragraph color
        'heading-dark': '#e2e8f0', // Dark theme heading color
        'paragraph-dark': '#dce2e8', // Dark theme paragraph color
        'deep-purple': '#0C0512',
        "semi-deep-purple": '#211B26',
        'rose-flash': '#D45CFE',
        primary: '#3b82f6', // blue-500
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
