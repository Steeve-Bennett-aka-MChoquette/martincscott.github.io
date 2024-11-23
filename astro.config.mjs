import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";

console.log('PUBLIC_EMAILJS_KEY:', process.env.PUBLIC_EMAILJS_KEY);
console.log('PUBLIC_EMAILJS_SERVICE_ID:', process.env.PUBLIC_EMAILJS_SERVICE_ID);
console.log('PUBLIC_EMAILJS_TEMPLATE_ID:', process.env.PUBLIC_EMAILJS_TEMPLATE_ID);
console.log('PUBLIC_TURNSTILE_KEY:', process.env.PUBLIC_TURNSTILE_KEY);

export default defineConfig({
  site: 'https://martincscott.com',
  base: '/',
  outDir: './dist',
  build: {
    assets: '_assets'
  },
  integrations: [
    tailwind(),
    icon({ compiler: 'astro' })
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts'
      }
    },
    ssr: {
      noExternal: [
        '@fontsource-variable/inter',
        '@fontsource-variable/bricolage-grotesque'
      ]
    }
  }
});