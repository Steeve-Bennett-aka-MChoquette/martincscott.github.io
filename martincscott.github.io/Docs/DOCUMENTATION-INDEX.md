# Martin C Scott Website Documentation

## Documentation Index

Welcome to the documentation for the Martin C Scott website. This index provides links to all documentation files for easy navigation.

### Core Documentation

1. **[DOCUMENTATION.md](./DOCUMENTATION.md)**: Main documentation with project overview, structure, and features
2. **[COMPONENTS.md](./COMPONENTS.md)**: Detailed documentation of all components, their props, and usage examples
3. **[WORDPRESS-INTEGRATION.md](./WORDPRESS-INTEGRATION.md)**: In-depth explanation of the WordPress API integration
4. **[STYLING.md](./STYLING.md)**: Comprehensive guide to the styling system, including Tailwind configuration, typography, colors, and responsive design
5. **[DARK-MODE.md](./DARK-MODE.md)**: Detailed documentation of the dark mode implementation and customization
6. **[SEO.md](./SEO.md)**: Detailed documentation of the SEO implementation and best practices
7. **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Instructions for deploying the website to various hosting platforms
8. **[CONTACT-FORM.md](./CONTACT-FORM.md)**: Detailed documentation of the contact form implementation with EmailJS and Cloudflare Turnstile

## Quick Reference

### Project Overview

The Martin C Scott website is a personal portfolio website built with Astro, featuring:

- Responsive design with dark mode support
- Blog section pulling content from WordPress API
- Contact form with EmailJS and Cloudflare Turnstile
- Modern UI with Tailwind CSS styling

### Technology Stack

- **Framework**: Astro v5.7.10
- **Styling**: Tailwind CSS v3.4.15
- **Typography**: Orbitron (headings), Inter (body text)
- **External Services**: WordPress API, EmailJS, Cloudflare Turnstile

### Key Features

1. **Responsive Design**: Mobile-first approach with responsive breakpoints
2. **Dark Mode**: Toggle with preference persistence
3. **Blog Integration**: WordPress API with pagination
4. **Contact Form**: EmailJS with Cloudflare Turnstile protection
5. **SEO Optimization**: Meta tags, proper heading structure, canonical URLs

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

The following environment variables are required:

```
PUBLIC_EMAILJS_KEY=your_key_here
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_TURNSTILE_KEY=your_turnstile_key
```

## Documentation Structure

### [DOCUMENTATION.md](./DOCUMENTATION.md)

The main documentation file providing an overview of the project, including:

- Project overview and features
- Technology stack
- Project structure
- Key components
- Styling system
- Features
- Environment variables
- Development workflow
- Deployment
- Future improvements

### [COMPONENTS.md](./COMPONENTS.md)

Detailed documentation of all components, including:

- UI components (Button, Link, Container, SectionHead)
- Layout components (MainLayout)
- Navigation components (Navbar, Dropdown)
- Content components (Hero, Features, Logos, CTA, Footer)
- Blog components (BlogCard, Pagination)
- Form components (ContactForm)
- Component relationships and hierarchy

### [WORDPRESS-INTEGRATION.md](./WORDPRESS-INTEGRATION.md)

In-depth explanation of the WordPress API integration, including:

- API configuration
- Data types
- API functions
- Usage in pages
- Customization options
- Error handling
- Performance considerations
- Future enhancements

### [STYLING.md](./STYLING.md)

Comprehensive guide to the styling system, including:

- Tailwind configuration
- Typography system
- Color system
- Dark mode implementation
- UI components styling
- Responsive design
- Special effects
- Blog content styling
- Form styling
- Best practices
- Extending the styling system

### [DARK-MODE.md](./DARK-MODE.md)

Detailed documentation of the dark mode implementation, including:

- Configuration in Tailwind
- Toggle implementation
- CSS implementation
- Component-specific dark mode styles
- Testing dark mode
- Customizing dark mode
- Best practices
- Common issues and solutions
- Advanced dark mode features
- Future enhancements

### [SEO.md](./SEO.md)

Detailed documentation of the SEO implementation, including:

- SEO component implementation
- Meta tags
- Heading structure
- Image optimization
- Blog post SEO
- URL structure
- Pagination
- Performance optimization
- Testing SEO
- Improving SEO
- Best practices
- Common issues and solutions
- Future enhancements

### [DEPLOYMENT.md](./DEPLOYMENT.md)

Instructions for deploying the website to various hosting platforms, including:

- Build configuration
- Build process
- Deployment options (GitHub Pages, Netlify, Vercel, Cloudflare Pages)
- Custom domain setup
- Environment variables
- Post-deployment verification
- Troubleshooting
- Performance optimization
- CI/CD setup
- Rollback procedures

### [CONTACT-FORM.md](./CONTACT-FORM.md)

Detailed documentation of the contact form implementation, including:

- Component structure
- HTML structure
- CSS styling
- EmailJS integration
- Cloudflare Turnstile integration
- Form submission logic
- Environment variables
- Setup instructions
- Form validation
- Success and error handling
- Customization options
- Testing procedures
- Security considerations
- Troubleshooting
- Performance optimization
- Accessibility features
- Future enhancements
