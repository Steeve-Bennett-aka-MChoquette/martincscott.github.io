import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";

export default defineConfig({
  site: 'https://static.martincscott.com',
  base: '/',
  outDir: './dist',
  build: {
    assets: '_assets'
  },
  i18n: {
    defaultLocale: 'fr',  // Set French as default
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true  // This will create /fr/ and /en/ routes
    }
  },
  integrations: [
    tailwind(),
    icon({ 
      compiler: 'astro',
      include: {
        // Include BoxIcons (bx) for contact page icons
        bx: '*', // This will include all BoxIcons
      }
    })
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@utils': '/src/utils'
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
