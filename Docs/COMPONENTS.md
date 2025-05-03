# Component Documentation

This document provides detailed information about the components used in the Martin C Scott website. It covers the purpose, props, and usage examples for each component.

## UI Components

### Button (`src/components/ui/button.astro`)

A versatile button component with various styles and sizes.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"md" \| "lg"` | `"md"` | Button size |
| `block` | `boolean` | `false` | Whether the button should be full width |
| `style` | `"outline" \| "primary" \| "inverted"` | `"primary"` | Button style |
| `class` | `string` | `undefined` | Additional CSS classes |

#### Usage Example

```astro
<Button size="lg" style="outline">Click Me</Button>
<Button block>Full Width Button</Button>
```

### Link (`src/components/ui/link.astro`)

A styled link component with multiple variants.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | Required | Link destination |
| `size` | `"md" \| "lg"` | `"lg"` | Link size |
| `block` | `boolean` | `false` | Whether the link should be full width |
| `style` | `"outline" \| "primary" \| "inverted" \| "muted"` | `"primary"` | Link style |
| `class` | `string` | `undefined` | Additional CSS classes |

#### Usage Example

```astro
<Link href="/about" size="lg" style="primary">About Us</Link>
<Link href="https://example.com" style="outline" target="_blank">External Link</Link>
```

### Container (`src/components/container.astro`)

A container component for consistent page width.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `class` | `string` | `undefined` | Additional CSS classes |

#### Usage Example

```astro
<Container>
  <h1>Page Content</h1>
  <p>This content will be constrained to the max width.</p>
</Container>
```

### SectionHead (`src/components/sectionhead.astro`)

A section header with title and description.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `string` | `"center"` | Text alignment |

#### Slots

| Slot | Description |
|------|-------------|
| `title` | Section title |
| `desc` | Section description |

#### Usage Example

```astro
<Sectionhead>
  <Fragment slot="title">About Us</Fragment>
  <Fragment slot="desc">Learn more about our company</Fragment>
</Sectionhead>
```

## Layout Components

### MainLayout (`src/layouts/MainLayout.astro`)

The primary layout used across all pages.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Page title |

#### Usage Example

```astro
<MainLayout title="Home Page">
  <div>Page content goes here</div>
</MainLayout>
```

## Navigation Components

### Navbar (`src/components/navbar/navbar.astro`)

Main navigation with responsive mobile menu.

#### Usage Example

```astro
<Navbar />
```

### Dropdown (`src/components/navbar/dropdown.astro`)

Dropdown menu for navbar items.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Dropdown title |
| `lastItem` | `boolean` | `false` | Whether this is the last item in the navbar |
| `children` | `array` | Required | Array of dropdown items |

#### Usage Example

```astro
<Dropdown 
  title="Features" 
  lastItem={false}
  children={[
    { title: "Feature 1", path: "/feature-1" },
    { title: "Feature 2", path: "/feature-2" }
  ]}
/>
```

## Content Components

### Hero (`src/components/hero.astro`)

Hero section with image and call-to-action buttons.

#### Usage Example

```astro
<Hero />
```

### Features (`src/components/features.astro`)

Features grid showcasing capabilities.

#### Usage Example

```astro
<Features />
```

### Logos (`src/components/logos.astro`)

Technology logos section.

#### Usage Example

```astro
<Logos />
```

### CTA (`src/components/cta.astro`)

Call-to-action section.

#### Usage Example

```astro
<Cta />
```

### Footer (`src/components/footer.astro`)

Site footer with copyright information.

#### Usage Example

```astro
<Footer />
```

## Blog Components

### BlogCard (`src/components/BlogCard.astro`)

Card component for blog post previews.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `post` | `WordPressPost` | Required | WordPress post object |

#### Usage Example

```astro
<BlogCard post={post} />
```

### Pagination (`src/components/Pagination.astro`)

Pagination component for blog listing.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | Required | Current page number |
| `totalPages` | `number` | Required | Total number of pages |
| `baseUrl` | `string` | Required | Base URL for pagination links |
| `indexUrl` | `string` | Required | URL for the first page |

#### Usage Example

```astro
<Pagination 
  currentPage={1} 
  totalPages={5} 
  baseUrl="/blog/page" 
  indexUrl="/blog" 
/>
```

## Form Components

### ContactForm (`src/components/contactform.astro`)

Contact form with EmailJS integration and Cloudflare Turnstile protection.

#### Usage Example

```astro
<Contactform />
```

## Component Relationships

The components are organized in a hierarchical structure:

1. `MainLayout` wraps all pages and includes:
   - `Navbar` (which may include `Dropdown` components)
   - Page content (via `<slot />`)
   - `Footer`

2. Most pages use `Container` to maintain consistent width

3. Common page structure:
   ```
   MainLayout
   └── Container
       ├── SectionHead (optional)
       └── Page-specific components
   ```

4. The homepage (`index.astro`) includes:
   ```
   MainLayout
   └── Container
       ├── Hero
       ├── Features
       ├── Logos
       └── Cta
   ```

5. The blog listing page includes:
   ```
   MainLayout
   └── Container
       ├── SectionHead
       ├── BlogCard (multiple)
       └── Pagination
   ```

This component architecture promotes reusability and maintainability across the website.
