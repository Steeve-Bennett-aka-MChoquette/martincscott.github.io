import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";

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