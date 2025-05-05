[← Documentation Hub](./README-home.md) | [Project README](./README.md)

---

# Deployment Guide

This document provides instructions for deploying the Martin C Scott website to various hosting platforms.

## Overview

The website is built with Astro, which generates static HTML files that can be deployed to any static hosting service. The current configuration is set up for GitHub Pages deployment, but the site can be deployed to other platforms with minimal changes.

## Build Configuration

The build configuration is defined in `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://martincscott.com',
  base: '/',
  outDir: './dist',
  build: {
    assets: '_assets'
  },
  // other configuration...
});
```

Key settings:

- **site**: The production URL of your website
- **base**: The base path of your website (useful for subpath deployments)
- **outDir**: The directory where the built files will be output
- **build.assets**: The directory where assets will be placed within the output directory

## Build Process

To build the website for production:

1. Ensure all environment variables are set in a `.env` file (copy from `.env.example`)
2. Run the build command:

```bash
npm run build
```

This will:
- Generate static HTML, CSS, and JavaScript files
- Optimize images and other assets
- Output everything to the `./dist/` directory

## Deployment Options

### GitHub Pages

The website is currently configured for GitHub Pages deployment, as indicated by the presence of CNAME files.

#### Manual Deployment

1. Build the website:
```bash
npm run build
```

2. Push the `dist` directory to the `gh-pages` branch:
```bash
git subtree push --prefix dist origin gh-pages
```

#### Using GitHub Actions

Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          PUBLIC_EMAILJS_KEY: ${{ secrets.PUBLIC_EMAILJS_KEY }}
          PUBLIC_EMAILJS_SERVICE_ID: ${{ secrets.PUBLIC_EMAILJS_SERVICE_ID }}
          PUBLIC_EMAILJS_TEMPLATE_ID: ${{ secrets.PUBLIC_EMAILJS_TEMPLATE_ID }}
          PUBLIC_TURNSTILE_KEY: ${{ secrets.PUBLIC_TURNSTILE_KEY }}

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

Make sure to add the required secrets in your GitHub repository settings.

### Netlify

#### Manual Deployment

1. Build the website:
```bash
npm run build
```

2. Deploy the `dist` directory using Netlify CLI:
```bash
npx netlify deploy --prod --dir=dist
```

#### Using Netlify UI

1. Push your code to a GitHub repository
2. Log in to Netlify and click "New site from Git"
3. Select your repository
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add the required environment variables in the Netlify UI
6. Click "Deploy site"

### Vercel

#### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

#### Using Vercel UI

1. Push your code to a GitHub repository
2. Log in to Vercel and click "New Project"
3. Select your repository
4. Configure the build settings:
   - Framework Preset: Astro
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add the required environment variables in the Vercel UI
6. Click "Deploy"

### Cloudflare Pages

1. Push your code to a GitHub repository
2. Log in to Cloudflare Pages and click "Create a project"
3. Select your repository
4. Configure the build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Add the required environment variables
6. Click "Save and Deploy"

## Custom Domain Setup

### GitHub Pages

1. Add a `CNAME` file to the `public` directory with your domain name:
```
martincscott.com
```

2. Configure your domain's DNS settings:
   - Add an A record pointing to GitHub Pages IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Or add a CNAME record pointing to your GitHub Pages URL:
     ```
     yourusername.github.io
     ```

3. In your GitHub repository settings, under "Pages", add your custom domain and enable HTTPS.

### Other Platforms

Most other platforms (Netlify, Vercel, Cloudflare Pages) have straightforward UI options for adding custom domains. Follow their respective documentation for detailed instructions.

## Environment Variables

The website requires several environment variables for full functionality:

```
PUBLIC_EMAILJS_KEY=your_key_here
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_TURNSTILE_KEY=your_turnstile_key
```

Make sure to add these variables to your hosting platform's environment variable settings.

## Post-Deployment Verification

After deploying, verify that:

1. The website loads correctly at your domain
2. All pages are accessible
3. The blog loads posts from WordPress
4. The contact form works properly
5. Dark mode toggle functions correctly
6. All images and assets load properly

## Troubleshooting

### 404 Errors on Page Refresh

If you encounter 404 errors when refreshing pages, you may need to configure your hosting platform to handle client-side routing:

- **GitHub Pages**: Add a `404.html` file that redirects to your index page
- **Netlify**: Add a `_redirects` file to the `public` directory:
  ```
  /* /index.html 200
  ```
- **Vercel**: Add a `vercel.json` file:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### Missing Environment Variables

If certain features don't work, check that all required environment variables are properly set on your hosting platform.

### CORS Issues with WordPress API

If the blog doesn't load, check for CORS issues with the WordPress API. You may need to:

1. Install a CORS plugin on your WordPress site
2. Configure your WordPress site to allow requests from your domain

## Performance Optimization

To improve performance after deployment:

1. Use Lighthouse or PageSpeed Insights to identify performance issues
2. Consider enabling additional optimizations in `astro.config.mjs`:
   ```javascript
   build: {
     assets: '_assets',
     inlineStylesheets: 'auto'
   }
   ```
3. Implement a CDN for faster content delivery
4. Enable HTTP/2 or HTTP/3 on your server
5. Configure appropriate caching headers

## Continuous Integration/Continuous Deployment (CI/CD)

For automated deployments, consider setting up a CI/CD pipeline:

1. GitHub Actions (example provided above)
2. GitLab CI/CD
3. CircleCI
4. Jenkins

This will automate the build and deployment process whenever changes are pushed to the main branch.

## Rollback Procedure

If you need to rollback to a previous version:

### GitHub Pages

1. Find the commit hash of the working version
2. Build that version:
   ```bash
   git checkout <commit-hash>
   npm install
   npm run build
   ```
3. Force push to the gh-pages branch:
   ```bash
   git subtree push --prefix dist origin gh-pages --force
   ```

### Other Platforms

Most other platforms have rollback functionality in their UI. Navigate to the deployments section and select a previous successful deployment to rollback.
