# Styling System Documentation

This document provides detailed information about the styling system used in the Martin C Scott website.

## Overview

The website uses Tailwind CSS for styling, with custom configuration for colors, typography, and dark mode. The styling approach focuses on:

1. Consistent design language across the site
2. Responsive layouts for all screen sizes
3. Dark mode support with smooth transitions
4. Custom typography with web fonts
5. Reusable UI components with consistent styling

## Tailwind Configuration

The Tailwind CSS configuration is defined in `tailwind.config.mjs`:

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',  // Class-based dark mode
  theme: {
    extend: {
      colors: {
        heading: '#1a202c', // Light theme heading color
        paragraph: '#353d4a', // Light theme paragraph color
        'heading-dark': '#e2e8f0', // Dark theme heading color
        'paragraph-dark': '#dce2e8', // Dark theme paragraph color
        'deep-purple': '#0C0512',
        'rose-flash': '#D45CFE',
      },
    },
  },
  plugins: [],
}
```

### Key Configuration Points

1. **Content Paths**: Scans all Astro, HTML, JS, TS, and other files for Tailwind classes
2. **Dark Mode**: Uses class-based approach (`darkMode: 'class'`) rather than media queries
3. **Custom Colors**: Defines semantic color variables for consistent theming
4. **Extended Theme**: Builds upon Tailwind's default theme rather than replacing it

## Typography System

The website uses a dual-font approach:

1. **Orbitron**: Used for headings and display text
2. **Inter Variable**: Used for body text and UI elements

### Font Implementation

Fonts are loaded in the `MainLayout.astro` file:

```astro
import "@fontsource-variable/inter/index.css";
```

And via Google Fonts in the global styles:

```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');
```

### Typography Classes

Global typography styles are defined in `MainLayout.astro`:

```css
/* Base heading styles with Orbitron */
h1, h2, h3, h4, h5, h6 {
  @apply text-heading;
  font-family: "Orbitron", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: 600;
}

/* Specific heading weights */
h1 { font-weight: 700; }
h2 { font-weight: 600; }
h3 { font-weight: 500; }

/* Text styles with Inter */
p {
  @apply text-paragraph;
  font-family: "Inter", sans-serif;
}

.dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
  @apply text-heading-dark;
}

.dark p {
  @apply text-paragraph-dark;
}

/* Additional utility classes */
.text-inter {
  font-family: "Inter", sans-serif;
}

/* Orbitron utilities */
.orbitron-heading {
  font-family: "Orbitron", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.orbitron-regular { font-weight: 400; }
.orbitron-medium { font-weight: 500; }
.orbitron-semibold { font-weight: 600; }
.orbitron-bold { font-weight: 700; }
.orbitron-black { font-weight: 900; }
```

## Color System

The color system is designed to support both light and dark modes with semantic color variables:

### Light Mode Colors

- **Headings**: `text-heading` (#1a202c)
- **Paragraph Text**: `text-paragraph` (#353d4a)
- **Background**: `bg-slate-100`
- **UI Elements**: Various slate/gray shades

### Dark Mode Colors

- **Headings**: `text-heading-dark` (#e2e8f0)
- **Paragraph Text**: `text-paragraph-dark` (#dce2e8)
- **Background**: `bg-deep-purple` (#0C0512)
- **UI Elements**: Darker variants of light mode colors

### Accent Colors

- **Rose Flash**: `rose-flash` (#D45CFE) - Used for highlights, borders, and interactive elements

## Dark Mode Implementation

The dark mode is implemented using a class-based approach with localStorage persistence:

### Toggle Functionality

The dark mode toggle is implemented in `MainLayout.astro`:

```javascript
const switchTheme = document.querySelector(
  "[data-switch-theme]"
) as HTMLButtonElement;

if (
  localStorage.getItem("appTheme") === "dark" ||
  (!("appTheme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

if (switchTheme) {
  switchTheme.addEventListener("click", (e) => {
    e.preventDefault();
    const doc = document.documentElement;
    if (doc) {
      if (localStorage.getItem("appTheme")) {
        if (localStorage.getItem("appTheme") === "light") {
          doc.classList.add("dark");
          localStorage.setItem("appTheme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("appTheme", "light");
        }
      } else {
        if (doc.classList.contains("dark")) {
          doc.classList.remove("dark");
          localStorage.setItem("appTheme", "light");
        } else {
          doc.classList.add("dark");
          localStorage.setItem("appTheme", "dark");
        }
      }
    }
  });
}
```

### Dark Mode Toggle Button

The toggle button is implemented in the navbar:

```astro
<button 
  data-switch-theme 
  class="outline-none flex relative text-heading-2 rounded-full p-2 border border-box-border"
>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" class="w-6 h-6 dark:flex hidden">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 dark:hidden">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
</svg>
  <span class="sr-only">switch theme</span>
</button>
```

## UI Components Styling

The website uses a set of reusable UI components with consistent styling:

### Button Component

The button component (`src/components/ui/button.astro`) supports multiple styles and sizes:

```javascript
const sizes = {
  md: "px-5 py-2.5",
  lg: "px-6 py-3",
};

const styles = {
  outline: "border-2 border-black hover:bg-black text-black hover:text-white",
  primary:
    "bg-black dark:bg-slate-100 dark:text-black text-white hover:bg-slate-900 border-2 border-transparent",
};
```

### Link Component

The link component (`src/components/ui/link.astro`) provides styled links with multiple variants:

```javascript
const styles = {
  outline: "bg-white border-2 border-black hover:bg-gray-100 text-black dark:bg-black dark:border-white dark:hover:bg-gray-800 dark:text-white",
  primary: "bg-black text-white hover:bg-gray-800 border-2 border-transparent dark:bg-white dark:text-black dark:hover:bg-gray-200",
  inverted: "bg-white text-black border-2 border-transparent dark:bg-black dark:text-white",
  muted: "bg-gray-100 hover:bg-gray-200 border-2 border-transparent dark:bg-gray-800 dark:hover:bg-gray-700",
};
```

## Responsive Design

The website uses a mobile-first approach with responsive breakpoints:

### Breakpoints

- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

### Container

The container component (`src/components/container.astro`) ensures consistent width across the site:

```astro
<div class:list={["max-w-screen-xl mx-auto px-5", className]}>
  <slot />
</div>
```

### Responsive Examples

#### Responsive Grid

```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {posts.map((post) => (
    <BlogCard post={post} />
  ))}
</div>
```

#### Responsive Typography

```astro
<h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight xl:tracking-tighter">
  Every day is taco ipsum tuesday
</h1>
```

#### Responsive Layout

```astro
<div class="flex flex-col md:flex-row gap-10 mx-auto max-w-4xl mt-16">
  <div class="flex-1">
    <!-- Content -->
  </div>
  <div class="flex-1">
    <!-- Content -->
  </div>
</div>
```

## Special Effects

### Gradient Backgrounds

The homepage uses gradient backgrounds with masking for visual interest:

```astro
<div class="absolute left-0 top-[35rem] h-[600px] w-[calc(max(50vw,300px))] -translate-y-1/2 translate-x-[-60%] rounded-full bg-blue-purple-gradient opacity-75 mask-radial-gradient z-[-5]"></div>
```

```css
.bg-blue-purple-gradient {
  background-image: linear-gradient(83.21deg, #d946ef, #b845ed);
}

.bg-orange-yellow-gradient {
  background-image: linear-gradient(266.93deg, #f0abfc, #ff7d54);
}

.mask-radial-gradient {
  -webkit-mask-image: radial-gradient(rgba(0,0,0,.6), transparent 60%);
  mask-image: radial-gradient(rgba(0,0,0,.6), transparent 60%);
}
```

### Hero Image Mask

The hero image uses an SVG mask for a unique shape:

```css
.hero-mask {
  position: relative;
  overflow: hidden;
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="white" d="M38.1,-52.6C47.3,-45.4,51.5,-32.3,55.6,-18.1C59.8,-3.9,63.8,12.4,60.5,25.6C57.3,38.8,46.9,48.8,35.8,55.3C24.8,61.7,12.4,64.7,-0.2,64.9C-12.8,65.1,-25.6,62.6,-37.4,55.7C-49.2,48.8,-60,37.4,-64.8,23.4C-69.6,9.5,-68.4,-6.9,-61.9,-20.6C-55.5,-34.3,-43.8,-45.3,-30.8,-52.4C-17.8,-59.6,-8.9,-62.9,2.7,-66.1C14.3,-69.2,28.6,-72.9,38.1,-52.6Z" transform="translate(105 80) scale(1.6)" /></svg>');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="white" d="M38.1,-52.6C47.3,-45.4,51.5,-32.3,55.6,-18.1C59.8,-3.9,63.8,12.4,60.5,25.6C57.3,38.8,46.9,48.8,35.8,55.3C24.8,61.7,12.4,64.7,-0.2,64.9C-12.8,65.1,-25.6,62.6,-37.4,55.7C-49.2,48.8,-60,37.4,-64.8,23.4C-69.6,9.5,-68.4,-6.9,-61.9,-20.6C-55.5,-34.3,-43.8,-45.3,-30.8,-52.4C-17.8,-59.6,-8.9,-62.9,2.7,-66.1C14.3,-69.2,28.6,-72.9,38.1,-52.6Z" transform="translate(105 80) scale(1.6)" /></svg>');
  mask-repeat: no-repeat;
  mask-size: cover;
}
```

### Noise Texture

A subtle noise texture is applied to the background for added depth:

```astro
<div class="noise-container">
  <div class="noise"></div>
  <!-- Content -->
</div>
```

## Blog Content Styling

The blog post content has custom styling to ensure readability and consistent design:

```css
/* Additional styling for blog content */
.blog-content :global(h1),
.blog-content :global(h2),
.blog-content :global(h3),
.blog-content :global(h4),
.blog-content :global(h5),
.blog-content :global(h6) {
  margin-top: 2em;
  margin-bottom: 0.75em;
  line-height: 1.3;
}

.blog-content :global(h2) {
  font-size: 2rem;
  font-weight: 700;
}

.blog-content :global(h3) {
  font-size: 1.8rem;
  font-weight: 700;
}

.blog-content :global(h4) {
  font-size: 1.5rem;
  font-weight: 700;
}

.blog-content :global(p) {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  line-height: 1.8;
  font-size: 1.2rem;
}

.blog-content :global(ul),
.blog-content :global(ol) {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  padding-left: 1.5em;
}

.blog-content :global(li) {
  margin-bottom: 0.75em;
  line-height: 1.7;
}

.blog-content :global(img) {
  border-radius: 0.5rem;
  margin: 2.5rem auto;
}

.blog-content :global(blockquote) {
  border-left-width: 4px;
  border-left-color: theme('colors.rose-flash');
  padding-left: 1.5rem;
  font-style: italic;
  margin: 2.5rem 0;
  color: theme('colors.gray.600');
}

.blog-content :global(blockquote p) {
  font-size: 1.25rem;
}

.blog-content :global(pre) {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.blog-content :global(hr) {
  margin: 3rem 0;
  border-color: theme('colors.gray.200');
}

.dark .blog-content :global(hr) {
  border-color: theme('colors.gray.700');
}

.blog-content :global(a) {
  color: theme('colors.rose-flash');
  text-decoration: underline;
}

.blog-content :global(a:hover) {
  text-decoration: none;
}

/* Add a subtle background to code blocks */
.blog-content :global(pre code) {
  background-color: theme('colors.gray.100');
}

.dark .blog-content :global(pre code) {
  background-color: theme('colors.gray.800');
}
```

## Form Styling

The contact form has custom styling for validation states:

```css
.invalid-feedback,
.empty-feedback {
  display: none;
}
.was-validated :placeholder-shown:invalid ~ .empty-feedback {
  display: block;
}
.was-validated :not(:placeholder-shown):invalid ~ .invalid-feedback {
  display: block;
}
.is-invalid,
.was-validated :invalid {
  border-color: #dc3545;
}
```

## Best Practices

### 1. Use Semantic Tailwind Classes

Prefer semantic class names that describe the purpose rather than the appearance:

```html
<!-- Good -->
<div class="text-heading dark:text-heading-dark">
  Heading Text
</div>

<!-- Avoid -->
<div class="text-gray-800 dark:text-gray-200">
  Heading Text
</div>
```

### 2. Responsive Design

Always design with mobile-first approach:

```html
<!-- Start with mobile styles, then add larger screen styles -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Content -->
</div>
```

### 3. Dark Mode Support

Always provide dark mode variants for color-related classes:

```html
<div class="bg-white text-black dark:bg-deep-purple dark:text-white">
  <!-- Content -->
</div>
```

### 4. Use UI Components

Leverage the existing UI components for consistent styling:

```astro
<Button size="lg" style="primary">Click Me</Button>
```

Instead of:

```html
<button class="px-6 py-3 bg-black text-white hover:bg-gray-800 rounded">
  Click Me
</button>
```

### 5. Typography Consistency

Use the defined typography classes for consistent text styling:

```html
<h2 class="text-4xl lg:text-5xl font-bold lg:tracking-tight">
  Heading Text
</h2>
<p class="text-lg mt-4 text-slate-600">
  Paragraph text
</p>
```

## Extending the Styling System

### Adding New Colors

To add new colors, extend the Tailwind configuration in `tailwind.config.mjs`:

```javascript
theme: {
  extend: {
    colors: {
      // Existing colors
      'heading': '#1a202c',
      // New colors
      'new-color': '#3b82f6',
      'new-color-dark': '#1d4ed8',
    },
  },
},
```

### Adding New Components

When creating new components, follow the existing patterns:

1. Use Tailwind classes for styling
2. Support dark mode with appropriate variants
3. Make components responsive
4. Use semantic class names
5. Provide appropriate props for customization

### Custom CSS

If you need custom CSS that can't be achieved with Tailwind, add it to the component's `<style>` block:

```astro
<style>
  .custom-element {
    /* Custom CSS here */
  }
</style>
```

Or for global styles, add them to the `MainLayout.astro` file's `<style is:global>` block.
