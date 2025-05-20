# CSS Optimization Plan

## Objective
Ensure consistency with Tailwind's utility-first approach while focusing on gradient components and dark mode styles. Preserve exact visual appearance while reducing custom CSS.

## Files to Modify
1. `tailwind.config.mjs` - Extend theme with custom colors and animations
2. `src/layouts/MainLayout.astro` - Update CSS imports and class usage
3. `src/styles/utilities.css` - Remove redundant custom classes

## Color Extensions (tailwind.config.mjs)
```js
theme: {
  extend: {
    colors: {
      'heading': '#1a202c',
      'paragraph': '#353d4a',
      'heading-dark': '#e2e8f0',
      'paragraph-dark': '#dce2e8',
      'deep-purple': '#0C0512',
      'semi-deep-purple': '#211B26',
      'rose-flash': '#D45CFE',
      'custom-orange': '#ff7d54',
      'custom-cyan': '#16a4c8',
      'custom-pink': '#eb75d8',
      'custom-purple': '#b845ed',
    }
  }
}
```

## Animation Extensions (tailwind.config.mjs)
```js
theme: {
  extend: {
    keyframes: {
      'float-1': { 
        '0%': { transform: 'translate3d(-60%, -50%, 0) scale(1)' },
        '25%': { transform: 'translate3d(-45%, -40%, 0) scale(1.1)' },
        '50%': { transform: 'translate3d(-50%, -60%, 0) scale(0.95)' },
        '75%': { transform: 'translate3d(-65%, -55%, 0) scale(1.05)' },
        '100%': { transform: 'translate3d(-60%, -50%, 0) scale(1)' }
      },
      // Add similar keyframe definitions for float-2 through float-6
    },
    animation: {
      'float-1': 'float-1 15s infinite ease-in-out alternate',
      // Add similar animation definitions for float-2 through float-6
    }
  }
}
```

## Gradient Component Optimization

### Before (utilities.css)
```css
.bg-purple-purple-gradient {
  background-image: linear-gradient(83.21deg, #d946ef, #b845ed);
}
```

### After (HTML Usage)
```html
<div class="bg-gradient-to-r from-fuchsia-500 via-custom-purple to-fuchsia-300"></div>
```

## Gradient Border Component Optimization

### Before (utilities.css)
```css
.gradient-border {
  position: relative;
  border-radius: 0.5rem;
  background: #1e1e2e;
}

.gradient-border::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #d946ef, #b845ed, #f0abfc, #ff7d54, #16a4c8, #eb75d8);
  border-radius: 0.625rem;
  background-size: 300% 300%;
  animation: gradientMove 6s ease infinite;
}
```

### After (HTML Usage)
```html
<div class="relative rounded-lg bg-semi-deep-purple transition-transform duration-300 before:absolute before:inset-[-2px] before:rounded-[0.625rem] before:bg-gradient-to-r before:from-fuchsia-500 before:via-custom-purple before:to-fuchsia-300 before:bg-[300%_300%] before:animate-gradientMove before:content-['']"></div>
```

## Dark Mode Optimization

### Before (utilities.css)
```css
.dark .gradient-border::after {
  box-shadow: 0 0 15px 5px rgba(236, 72, 153, 0.3);
}
```

### After (HTML Usage with Tailwind)
```html
<div class="gradient-border::after dark:shadow-[0_0_15px_5px_rgba(236,72,153,0.3)]"></div>
```

## Typography Optimization

### Before (utilities.css)
```css
.text-inter {
  font-family: "Inter", sans-serif;
}
```

### After (HTML Usage)
```html
<p class="font-inter"></p>
```

## Implementation Steps
1. Update tailwind.config.mjs with extended colors and animations
2. Modify MainLayout.astro to use Tailwind's @layer directives instead of custom CSS imports
3. Gradually replace custom classes in components with Tailwind utilities
4. Remove redundant CSS from utilities.css as components are converted