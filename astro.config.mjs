import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://martincscott.github.io',
  base: '/',
  outDir: './dist',
  build: {
    assets: '_assets'
  }
});