import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';

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
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-CA',
          en: 'en-CA'
        }
      }
    }),
    icon({
      compiler: 'astro',
      include: {
        // Include only the BoxIcons actually used in the project
        bx: [
          'bx-code',
          'bx-desktop',
          'bx-envelope',
          'bxl-docker',
          'bxl-flutter',
          'bxl-github',
          'bxl-google',
          'bxl-linkedin',
          'bxl-vuejs',
          'bxl-wordpress',
          'bxs-cloud-download'
        ]
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
