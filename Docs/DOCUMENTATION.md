# Martin C Scott Website Documentation

## Project Overview

This is a personal portfolio website built with Astro, a modern static site generator. The site features a responsive design with dark mode support, a blog section that pulls content from WordPress, and a contact form with Cloudflare Turnstile protection.

## Getting Started

To get started with this project:

1. **Clone the repository**: `git clone [repository-url]`
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm run dev` (runs at localhost:4321)
4. **Create a `.env` file** with your environment variables (see Environment Variables section)

## Documentation Structure

This documentation is organized into several files:

1. **DOCUMENTATION.md** (this file): Overview of the project, structure, and features
2. **[COMPONENTS.md](./COMPONENTS.md)**: Detailed documentation of all components, their props, and usage examples
3. **[WORDPRESS-INTEGRATION.md](./WORDPRESS-INTEGRATION.md)**: In-depth explanation of the WordPress API integration
4. **[STYLING.md](./STYLING.md)**: Comprehensive guide to the styling system, including Tailwind configuration, typography, colors, and responsive design
5. **[DARK-MODE.md](./DARK-MODE.md)**: Detailed documentation of the dark mode implementation and customization
6. **[SEO.md](./SEO.md)**: Detailed documentation of the SEO implementation and best practices
7. **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Instructions for deploying the website to various hosting platforms
8. **[CONTACT-FORM.md](./CONTACT-FORM.md)**: Detailed documentation of the contact form implementation with EmailJS and Cloudflare Turnstile

For a complete overview of all documentation files, see the **[DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md)** file.

## Technology Stack

- **Framework**: Astro v5.7.10
- **Styling**: Tailwind CSS v3.4.15
- **Typography**: 
  - Orbitron (headings)
  - Inter (body text)
- **Icons**: Astro Icon with Iconify sets (bx, simple-icons, uil)
- **External Services**:
  - WordPress API for blog content
  - EmailJS for contact form submission
  - Cloudflare Turnstile for bot protection

## Project Structure

```
/
├── public/               # Static assets
├── content/              # Content collections
│   └── team/             # Team member information
├── src/
│   ├── assets/           # Images and other assets
│   ├── components/       # UI components
│   │   ├── navbar/       # Navigation components
│   │   └── ui/           # Reusable UI elements
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utility functions
│   └── pages/            # Page routes
│       └── blog/         # Blog pages
└── .env.example          # Environment variables template
```

## Key Components

### Layouts

- **MainLayout.astro**: The primary layout used across all pages. Includes:
  - Meta tags with SEO optimization
  - Global styling
  - Dark mode toggle functionality
  - Navbar and Footer components

### Pages

- **index.astro**: Homepage with hero section, features, technology logos, and CTA
- **about.astro**: About page with profile information and skills
- **contact.astro**: Contact page with form and social links
- **blog/index.astro**: Blog listing page with pagination
- **blog/[slug].astro**: Dynamic blog post page
- **404.astro**: Custom 404 error page

### Components

#### Core Components
- **hero.astro**: Hero section with image and call-to-action buttons
- **features.astro**: Features grid showcasing Astro capabilities
- **logos.astro**: Technology logos section
- **cta.astro**: Call-to-action section
- **footer.astro**: Site footer with copyright information

#### UI Components
- **button.astro**: Reusable button component with various styles and sizes
- **link.astro**: Styled link component with multiple variants
- **container.astro**: Container for consistent page width
- **sectionhead.astro**: Section header with title and description

#### Blog Components
- **BlogCard.astro**: Card component for blog post previews
- **Pagination.astro**: Pagination component for blog listing

#### Navigation
- **navbar.astro**: Main navigation with responsive mobile menu
- **dropdown.astro**: Dropdown menu for navbar items

### Utilities

- **wordpress.ts**: Functions for fetching blog posts from WordPress API
  - `getAllPosts()`: Fetches paginated posts
  - `getPostBySlug()`: Fetches a single post by slug
  - `getTotalPages()`: Gets total number of pages for pagination

## Styling System

The project uses Tailwind CSS with a custom configuration:

- **Color Scheme**:
  - Light theme: Standard slate/gray colors
  - Dark theme: Deep purple background with custom text colors
  - Accent colors: Rose flash (#D45CFE) for highlights
  
- **Typography**:
  - Headings: Orbitron font with various weights
  - Body text: Inter variable font
  
- **Dark Mode**: Implemented using class-based approach with localStorage persistence

## Features

### 1. Responsive Design
- Mobile-first approach with responsive breakpoints
- Hamburger menu for mobile navigation
- Optimized images with different sizes for various viewports

### 2. Dark Mode
- Toggle button in the navigation
- Persists user preference using localStorage
- Respects system preference by default

### 3. Blog Integration
- Pulls content from WordPress API
- Pagination for blog listings
- Dynamic routes for individual blog posts
- Featured images and formatted content

### 4. Contact Form
- EmailJS integration for serverless form submission
- Form validation with proper error handling
- Cloudflare Turnstile protection against spam
- Success/error feedback for users

### 5. SEO Optimization
- Meta tags via astro-seo
- Proper heading structure
- Responsive images with alt text
- Canonical URLs

## Environment Variables

The following environment variables are required for full functionality:

```
PUBLIC_EMAILJS_KEY=your_key_here
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_TURNSTILE_KEY=your_turnstile_key
```

## Development Workflow

1. **Installation**: `npm install`
2. **Development**: `npm run dev` (starts server at localhost:4321)
3. **Build**: `npm run build` (outputs to ./dist/)
4. **Preview**: `npm run preview` (preview build locally)

## Deployment

The site is configured to be deployed to GitHub Pages, as indicated by the presence of CNAME files. The build output directory is set to `./dist/` in the Astro configuration.

## Future Improvements

Based on the codebase review, potential improvements could include:

1. Adding more content to the team section (currently just a placeholder)
2. Implementing a projects/portfolio page (referenced in about.astro but not implemented)
3. Enhancing the blog with categories and tags
4. Adding search functionality to the blog
5. Implementing analytics tracking
6. Adding more interactive elements using Astro's partial hydration
