# SEO Implementation

This document provides detailed information about the SEO implementation in the Martin C Scott website.

## Overview

The website implements various SEO best practices to ensure good search engine visibility and performance. The SEO implementation includes meta tags, proper heading structure, responsive images, canonical URLs, and more.

## Implementation Details

### SEO Component

The website uses the `astro-seo` package for SEO optimization. This is implemented in the `MainLayout.astro` file:

```astro
import { SEO } from "astro-seo";

// ...

const canonicalURL = new URL(Astro.url.pathname, Astro.site).toString();
const resolvedImageWithDomain = new URL(
  "/opengraph.jpg",
  Astro.site
).toString();

const { title } = Astro.props;
const makeTitle = title
  ? title + " | " + "Martin Choquette Scott"
  : "Dev Web";

// ...

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="generator" content={Astro.generator} />
  <SEO
    title={makeTitle}
    description="Martin C Scott - Software Developer & Technical Writer"
    canonical={canonicalURL}
    openGraph={{
      basic: {
        title: makeTitle,
        type: "website",
        image: resolvedImageWithDomain,
      },
      image: {
        alt: "Martin C Scott Homepage Screenshot",
      },
    }}
    twitter={{
      creator: "@martincscott",
      site: "@martincscott",
      card: "summary_large_image",
    }}
  />
  <!-- Other head elements -->
</head>
```

### Meta Tags

The website includes essential meta tags for SEO:

1. **Title Tag**: Dynamic title based on the page with a consistent format
2. **Description**: Concise description of the page content
3. **Canonical URL**: Prevents duplicate content issues
4. **Viewport**: Ensures proper rendering on mobile devices
5. **Open Graph Tags**: For better social media sharing
6. **Twitter Cards**: For Twitter sharing

### Heading Structure

The website follows a proper heading structure for SEO:

1. **H1**: Used only once per page for the main heading
2. **H2**: Used for section headings
3. **H3-H6**: Used for subsections in a hierarchical manner

Example from `about.astro`:

```astro
<Sectionhead>
  <Fragment slot="title">About Me</Fragment>
  <Fragment slot="desc">Software Developer & Technical Writer</Fragment>
</Sectionhead>

<div class="flex flex-col md:flex-row gap-10 mx-auto max-w-4xl mt-16">
  <!-- Image section -->
  
  <div class="flex-1 flex flex-col items-center justify-center">
    <h2 class="font-bold text-3xl text-gray-800">
      Hi, I'm Martin
    </h2>
    <p class="text-lg leading-relaxed text-slate-500 mt-3">
      I'm a software developer passionate about creating efficient, user-friendly 
      solutions and sharing knowledge through writing and open source contributions.
    </p>
    <!-- More content -->
  </div>
</div>
```

### Images

Images are optimized for SEO using Astro's built-in image optimization:

```astro
import { Picture } from "astro:assets";
import profileImage from "@/assets/placeholder.webp";

// ...

<Picture
  src={profileImage}
  alt="Martin Scott"
  sizes="(max-width: 800px) 100vw, 400px"
  width={600}
  height={800}
  class="w-full rounded-md transition shadow-lg bg-white object-cover object-center"
/>
```

Key image SEO features:

1. **Responsive Images**: Different sizes for different viewports
2. **Alt Text**: Descriptive alt text for accessibility and SEO
3. **Lazy Loading**: Images load only when needed
4. **WebP Format**: Modern image format for better performance
5. **Width and Height**: Prevents layout shifts during loading

### Blog Post SEO

Blog posts have additional SEO optimizations:

```astro
// src/pages/blog/[slug].astro
<MainLayout title={post.title.rendered}>
  <article class="py-16 px-4 max-w-4xl mx-auto">
    <header class="mb-16">
      <h1 class="text-5xl md:text-6xl mb-8 font-bold leading-tight" set:html={post.title.rendered} />
      <p class="text-gray-500 dark:text-gray-400 text-xl mb-12">
        Published on {formatDate(post.date)}
      </p>
      
      {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
        <div class="mb-14 rounded-lg overflow-hidden">
          <img 
            src={post._embedded['wp:featuredmedia'][0].source_url} 
            alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
            class="w-full max-h-[600px] object-cover"
          />
        </div>
      )}
    </header>
    
    <div class="prose-lg md:prose-xl lg:prose-2xl dark:prose-invert max-w-none blog-content">
      <div set:html={post.content.rendered} />
    </div>
    
    <!-- Back link -->
  </article>
</MainLayout>
```

Key blog SEO features:

1. **Dynamic Titles**: Each post has its own title
2. **Publish Date**: Indicates content freshness
3. **Featured Images**: With proper alt text
4. **Structured Content**: Proper heading hierarchy in content
5. **Semantic HTML**: Using article tags and other semantic elements

### URL Structure

The website uses a clean, SEO-friendly URL structure:

- Homepage: `/`
- About page: `/about`
- Contact page: `/contact`
- Blog index: `/blog`
- Blog pagination: `/blog/page/[page]`
- Blog posts: `/blog/[slug]`

### Pagination

The blog pagination is implemented in an SEO-friendly way:

```astro
// src/components/Pagination.astro
<nav aria-label="Pagination" class="flex justify-center mt-16">
  <ul class="inline-flex items-center -space-x-px">
    <!-- Previous button -->
    <li>
      <a href={currentPage === 1 ? "#" : currentPage === 2 ? indexUrl : `${baseUrl}/${currentPage - 1}`}
         class={`block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'}`}
         aria-disabled={currentPage === 1}>
        <span class="sr-only">Previous</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
      </a>
    </li>
    
    <!-- Page numbers -->
    {visiblePages.map(page => {
      // Page number rendering
    })}
    
    <!-- Next button -->
    <li>
      <a href={currentPage === totalPages ? "#" : `${baseUrl}/${currentPage + 1}`}
         class={`block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'}`}
         aria-disabled={currentPage === totalPages}>
        <span class="sr-only">Next</span>
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
      </a>
    </li>
  </ul>
</nav>
```

Key pagination SEO features:

1. **Accessible Navigation**: Proper ARIA labels
2. **Clean URLs**: First page is `/blog`, subsequent pages are `/blog/page/2`, etc.
3. **Previous/Next Links**: For easy navigation
4. **Current Page Indication**: Clearly shows the current page
5. **Disabled States**: Prevents navigation to non-existent pages

### Performance Optimization

The website includes performance optimizations that benefit SEO:

1. **Static Site Generation**: Pages are pre-rendered at build time
2. **Code Splitting**: Only necessary JavaScript is loaded
3. **Responsive Images**: Different sizes for different viewports
4. **CSS Optimization**: Tailwind's purge feature removes unused CSS
5. **Font Optimization**: Variable fonts for better performance

## Testing SEO

To test the website's SEO:

1. **Lighthouse**: Run Lighthouse in Chrome DevTools to get an SEO score
2. **Google Search Console**: Register the site and monitor performance
3. **Mobile-Friendly Test**: Use Google's Mobile-Friendly Test tool
4. **Rich Results Test**: Test structured data with Google's Rich Results Test
5. **Meta Tag Validator**: Validate Open Graph and Twitter Card tags

## Improving SEO

### Adding Structured Data

Add structured data to improve rich snippets in search results:

```astro
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Martin C Scott",
    "url": "https://martincscott.com",
    "jobTitle": "Software Developer & Technical Writer",
    "sameAs": [
      "https://github.com/martincscott",
      "https://linkedin.com/in/martincscott"
    ]
  }
</script>
```

### Adding a Sitemap

Create a sitemap for better indexing:

1. Install the `@astrojs/sitemap` package:
```bash
npm install @astrojs/sitemap
```

2. Add it to the Astro configuration:
```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://martincscott.com',
  integrations: [
    tailwind(),
    icon({ compiler: 'astro' }),
    sitemap()
  ],
  // other configuration...
});
```

### Adding a robots.txt File

Create a `robots.txt` file in the `public` directory:

```
User-agent: *
Allow: /

Sitemap: https://martincscott.com/sitemap.xml
```

### Improving Meta Descriptions

Add more specific meta descriptions to each page:

```astro
<SEO
  title={makeTitle}
  description="Martin C Scott is a software developer specializing in web development, technical writing, and open source contributions."
  // other SEO properties...
/>
```

### Adding Blog Post Schema

Add blog post schema to blog posts:

```astro
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "{post.title.rendered}",
    "datePublished": "{post.date}",
    "dateModified": "{post.modified}",
    "author": {
      "@type": "Person",
      "name": "Martin C Scott"
    },
    "image": "{post._embedded?.['wp:featuredmedia']?.[0]?.source_url}",
    "url": "https://martincscott.com/blog/{post.slug}"
  }
</script>
```

## Best Practices

### 1. Use Descriptive Titles

Each page should have a unique, descriptive title:

```astro
<MainLayout title="About Martin C Scott - Software Developer">
  <!-- Page content -->
</MainLayout>
```

### 2. Optimize Images

Always include alt text and optimize images:

```astro
<Picture
  src={image}
  alt="Descriptive alt text"
  sizes="(max-width: 800px) 100vw, 800px"
  width={800}
  height={600}
/>
```

### 3. Use Semantic HTML

Use semantic HTML elements for better accessibility and SEO:

```astro
<article>
  <header>
    <h1>Article Title</h1>
    <time datetime="2023-01-01">January 1, 2023</time>
  </header>
  <section>
    <h2>Section Title</h2>
    <p>Section content...</p>
  </section>
  <footer>
    <p>Article footer...</p>
  </footer>
</article>
```

### 4. Implement Canonical URLs

Always include canonical URLs to prevent duplicate content:

```astro
<SEO
  canonical={new URL(Astro.url.pathname, Astro.site).toString()}
  // other SEO properties...
/>
```

### 5. Optimize for Mobile

Ensure the website is fully responsive and mobile-friendly:

```astro
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Common SEO Issues and Solutions

### Slow Page Load Times

**Issue**: Pages take too long to load, affecting SEO.

**Solution**: 
- Optimize images further
- Implement lazy loading for below-the-fold content
- Minimize JavaScript and CSS
- Use a CDN for static assets

### Duplicate Content

**Issue**: Multiple URLs serving the same content.

**Solution**:
- Implement canonical URLs
- Use 301 redirects for old or alternate URLs
- Ensure consistent URL structure

### Missing Alt Text

**Issue**: Images without alt text are not accessible or SEO-friendly.

**Solution**:
- Add descriptive alt text to all images
- Use empty alt text (`alt=""`) for decorative images

### Poor Mobile Experience

**Issue**: Website doesn't work well on mobile devices.

**Solution**:
- Use responsive design
- Test on multiple devices
- Ensure touch targets are large enough
- Optimize for mobile performance

### Broken Links

**Issue**: Links that lead to 404 pages.

**Solution**:
- Regularly audit the site for broken links
- Implement a custom 404 page
- Set up redirects for changed URLs

## Future SEO Enhancements

1. **Implement Breadcrumbs**: Add breadcrumb navigation for better user experience and SEO
2. **Add FAQ Schema**: Implement FAQ schema for relevant pages
3. **Create an XML Sitemap**: Generate a comprehensive XML sitemap
4. **Implement Hreflang Tags**: For multilingual support if needed
5. **Add Local Business Schema**: If applicable for local SEO
6. **Implement AMP**: Consider Accelerated Mobile Pages for better mobile performance
7. **Add Social Sharing Buttons**: Make content more shareable
8. **Implement Content Snippets**: Use featured snippets optimization
9. **Add Related Posts**: Improve internal linking structure
10. **Implement Analytics**: Track SEO performance with Google Analytics
