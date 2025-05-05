# Dark Mode Implementation

This document provides detailed information about the dark mode implementation in the Martin C Scott website.

## Overview

The website features a dark mode toggle that allows users to switch between light and dark themes. The dark mode implementation uses a class-based approach with localStorage persistence and respects the user's system preference by default.

## Implementation Details

### Configuration

The dark mode is configured in the Tailwind CSS configuration file (`tailwind.config.mjs`):

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

The key setting is `darkMode: 'class'`, which tells Tailwind to use a class-based approach rather than a media query approach. This allows for manual toggling of dark mode.

### Toggle Implementation

The dark mode toggle is implemented in the `MainLayout.astro` file:

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

This script does the following:

1. Selects the theme toggle button using the `data-switch-theme` attribute
2. Checks if the user has a theme preference stored in localStorage
3. If not, checks the user's system preference using `window.matchMedia("(prefers-color-scheme: dark)").matches`
4. Adds or removes the `dark` class from the `html` element accordingly
5. Adds a click event listener to the toggle button that switches between light and dark mode
6. Stores the user's preference in localStorage for persistence

### Toggle Button

The toggle button is implemented in the navbar (`src/components/navbar/navbar.astro`):

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

The button includes:

1. A `data-switch-theme` attribute that the JavaScript uses to select the button
2. Two SVG icons: a sun icon for light mode and a moon icon for dark mode
3. Tailwind classes to show/hide the appropriate icon based on the current theme
4. A screen reader-only label for accessibility

### CSS Implementation

The dark mode styles are implemented using Tailwind's dark mode variant. For example:

```astro
<div class="bg-slate-100 dark:bg-deep-purple">
  <!-- Content -->
</div>
```

In this example, the background color is `bg-slate-100` in light mode and `bg-deep-purple` in dark mode.

The website also defines semantic color variables in the Tailwind configuration:

```javascript
colors: {
  heading: '#1a202c', // Light theme heading color
  paragraph: '#353d4a', // Light theme paragraph color
  'heading-dark': '#e2e8f0', // Dark theme heading color
  'paragraph-dark': '#dce2e8', // Dark theme paragraph color
  'deep-purple': '#0C0512',
  'rose-flash': '#D45CFE',
},
```

These are used throughout the site with the dark mode variant:

```astro
<h1 class="text-heading dark:text-heading-dark">
  Heading Text
</h1>
<p class="text-paragraph dark:text-paragraph-dark">
  Paragraph text
</p>
```

### Global Styles

Global styles for dark mode are defined in `MainLayout.astro`:

```css
h1, h2, h3, h4, h5, h6 {
  @apply text-heading;
  font-family: "Orbitron", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: 600;
}

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
```

This applies the appropriate text colors to headings and paragraphs in both light and dark modes.

## Component-Specific Dark Mode Styles

### UI Components

UI components like buttons and links have dark mode variants:

```javascript
// Button styles
const styles = {
  outline: "border-2 border-black hover:bg-black text-black hover:text-white",
  primary:
    "bg-black dark:bg-slate-100 dark:text-black text-white hover:bg-slate-900 border-2 border-transparent",
};

// Link styles
const styles = {
  outline: "bg-white border-2 border-black hover:bg-gray-100 text-black dark:bg-black dark:border-white dark:hover:bg-gray-800 dark:text-white",
  primary: "bg-black text-white hover:bg-gray-800 border-2 border-transparent dark:bg-white dark:text-black dark:hover:bg-gray-200",
  inverted: "bg-white text-black border-2 border-transparent dark:bg-black dark:text-white",
  muted: "bg-gray-100 hover:bg-gray-200 border-2 border-transparent dark:bg-gray-800 dark:hover:bg-gray-700",
};
```

### Blog Content

Blog content has specific dark mode styles:

```css
.blog-content :global(blockquote) {
  border-left-width: 4px;
  border-left-color: theme('colors.rose-flash');
  padding-left: 1.5rem;
  font-style: italic;
  margin: 2.5rem 0;
  color: theme('colors.gray.600');
}

.dark .blog-content :global(blockquote) {
  color: theme('colors.gray.400');
}

.blog-content :global(hr) {
  margin: 3rem 0;
  border-color: theme('colors.gray.200');
}

.dark .blog-content :global(hr) {
  border-color: theme('colors.gray.700');
}

.blog-content :global(pre code) {
  background-color: theme('colors.gray.100');
}

.dark .blog-content :global(pre code) {
  background-color: theme('colors.gray.800');
}
```

## Testing Dark Mode

To test dark mode:

1. Visit the website
2. Click the theme toggle button in the navbar
3. Verify that the theme changes
4. Refresh the page and verify that the theme persists
5. Test with different system preferences

## Customizing Dark Mode

### Adding New Dark Mode Colors

To add new dark mode colors, extend the Tailwind configuration:

```javascript
theme: {
  extend: {
    colors: {
      // Existing colors
      'heading': '#1a202c',
      'heading-dark': '#e2e8f0',
      // New colors
      'new-color': '#3b82f6',
      'new-color-dark': '#1d4ed8',
    },
  },
},
```

Then use them in your components:

```astro
<div class="text-new-color dark:text-new-color-dark">
  Custom colored text
</div>
```

### Modifying Dark Mode Behavior

To modify the dark mode behavior:

1. **Change the default theme**: Modify the condition in `MainLayout.astro` that checks for system preference
2. **Change the toggle behavior**: Modify the click event listener in `MainLayout.astro`
3. **Add a theme selector**: Implement a dropdown with multiple theme options instead of a simple toggle

### Adding Dark Mode Transitions

To add smooth transitions between light and dark mode:

```css
/* Add to global styles */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* For specific elements that need transitions */
.transition-theme {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

## Best Practices

### 1. Always Provide Dark Mode Variants

For any color-related classes, always provide a dark mode variant:

```astro
<div class="bg-white text-black dark:bg-deep-purple dark:text-white">
  <!-- Content -->
</div>
```

### 2. Use Semantic Color Variables

Use semantic color variables instead of direct color classes:

```astro
<!-- Good -->
<h1 class="text-heading dark:text-heading-dark">
  Heading Text
</h1>

<!-- Avoid -->
<h1 class="text-gray-800 dark:text-gray-200">
  Heading Text
</h1>
```

### 3. Test with System Preferences

Test dark mode with different system preferences:

- Light mode preference with light mode selected
- Light mode preference with dark mode selected
- Dark mode preference with light mode selected
- Dark mode preference with dark mode selected

### 4. Consider Accessibility

Ensure sufficient contrast in both light and dark modes:

- Use tools like the WebAIM Contrast Checker
- Test with screen readers
- Ensure focus states are visible in both modes

### 5. Use the `prefers-color-scheme` Media Query for Initial Load

This prevents a flash of the wrong theme on initial load:

```javascript
if (
  localStorage.getItem("appTheme") === "dark" ||
  (!("appTheme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
```

## Common Issues and Solutions

### Flash of Incorrect Theme

**Issue**: Users see a flash of the wrong theme when the page loads.

**Solution**: Add a script in the `<head>` to set the theme before the page renders:

```html
<script>
  if (
    localStorage.getItem("appTheme") === "dark" ||
    (!("appTheme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
</script>
```

### Inconsistent Theme Across Pages

**Issue**: The theme is different on different pages.

**Solution**: Ensure the theme script is included in all layouts and that it runs before the page renders.

### Images Not Adapting to Dark Mode

**Issue**: Images look out of place in dark mode.

**Solution**: Use different images for light and dark mode:

```astro
<img src="/light-image.png" class="dark:hidden" alt="Light mode image">
<img src="/dark-image.png" class="hidden dark:block" alt="Dark mode image">
```

Or add a filter to images in dark mode:

```css
.dark img:not(.no-dark-filter) {
  filter: brightness(0.8) contrast(1.2);
}
```

### SVG Icons Not Adapting to Dark Mode

**Issue**: SVG icons don't change color in dark mode.

**Solution**: Use `currentColor` in SVG fill and stroke attributes:

```html
<svg fill="currentColor" stroke="currentColor" class="text-black dark:text-white">
  <!-- SVG content -->
</svg>
```

## Advanced Dark Mode Features

### Theme Toggle Animation

Add an animation to the theme toggle:

```css
.theme-toggle-icon {
  transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-toggle-icon {
  transform: rotate(30deg);
}
```

### Multiple Color Schemes

Implement multiple color schemes instead of just light and dark:

```javascript
// In your theme toggle script
const themes = ['light', 'dark', 'sepia', 'blue'];
let currentThemeIndex = themes.indexOf(localStorage.getItem("appTheme") || 'light');

switchTheme.addEventListener("click", (e) => {
  e.preventDefault();
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const newTheme = themes[currentThemeIndex];
  
  // Remove all theme classes
  document.documentElement.classList.remove(...themes);
  // Add the new theme class
  document.documentElement.classList.add(newTheme);
  // Save to localStorage
  localStorage.setItem("appTheme", newTheme);
});
```

### System Theme Change Detection

Detect when the user changes their system theme:

```javascript
// Add this to your theme script
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem("appTheme")) {
    if (e.matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
});
```

## Future Enhancements

1. **Theme Customization**: Allow users to customize the dark theme colors
2. **Auto Theme Switching**: Automatically switch themes based on time of day
3. **Per-Component Theming**: Allow different components to have different themes
4. **Theme Presets**: Provide multiple theme presets for users to choose from
5. **Remember Position**: Remember the scroll position when switching themes
