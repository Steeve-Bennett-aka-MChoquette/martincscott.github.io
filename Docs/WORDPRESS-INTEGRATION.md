[← Documentation Hub](./README-home.md) | [Project README](./README.md)

---

# WordPress API Integration

This document explains how the Martin C Scott website integrates with the WordPress REST API to fetch and display blog content.

## Overview

The website uses the WordPress REST API to fetch blog posts from an external WordPress site. This allows the content to be managed through WordPress's user-friendly interface while displaying it within the Astro-built website.

## Implementation Details

### API Configuration

The WordPress API endpoint is configured in `src/lib/wordpress.ts`:

```typescript
const WORDPRESS_API_URL = 'https://catapultecommunication.com/wp-json/wp/v2';
```

This can be changed to any WordPress site that has the REST API enabled.

### Data Types

The WordPress post data structure is defined as a TypeScript interface:

```typescript
export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      avatar_urls: Record<string, string>;
    }>;
  };
}
```

### API Functions

The WordPress integration provides three main functions:

#### 1. `getAllPosts(page, perPage)`

Fetches a paginated list of posts.

```typescript
export async function getAllPosts(page = 1, perPage = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed=true&page=${page}&per_page=${perPage}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return [];
  }
}
```

- **Parameters**:
  - `page`: The page number to fetch (default: 1)
  - `perPage`: Number of posts per page (default: 10)
- **Returns**: Array of WordPress posts
- **Note**: Uses `_embed=true` to include featured images and author information

#### 2. `getPostBySlug(slug)`

Fetches a single post by its slug.

```typescript
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed=true&slug=${slug}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    
    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}
```

- **Parameters**:
  - `slug`: The post slug to fetch
- **Returns**: A single WordPress post or null if not found

#### 3. `getTotalPages(perPage)`

Gets the total number of pages based on posts per page.

```typescript
export async function getTotalPages(perPage = 10): Promise<number> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?per_page=${perPage}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    // WordPress returns total pages in headers
    const totalPages = Number(response.headers.get('X-WP-TotalPages') || '1');
    return totalPages;
  } catch (error) {
    console.error('Error fetching total pages:', error);
    return 1;
  }
}
```

- **Parameters**:
  - `perPage`: Number of posts per page (default: 10)
- **Returns**: Total number of pages
- **Note**: Uses the WordPress header `X-WP-TotalPages` to get the total pages

## Usage in Pages

### Blog Index Page

The blog index page (`src/pages/blog/index.astro`) uses the WordPress API to fetch posts and display them:

```typescript
const PER_PAGE = 9;
const page = 1;
const posts = await getAllPosts(page, PER_PAGE);
const totalPages = await getTotalPages(PER_PAGE);
```

These posts are then mapped to `BlogCard` components:

```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {posts.map((post) => (
    <BlogCard post={post} />
  ))}
</div>
```

### Blog Post Page

The individual blog post page (`src/pages/blog/[slug].astro`) uses the WordPress API to fetch a single post by slug:

```typescript
export async function getStaticPaths() {
  const posts = await getAllPosts(1, 100); // Fetch enough posts for static generation
  
  return posts.map(post => ({
    params: { slug: post.slug },
  }));
}

const { slug } = Astro.params;
const post = await getPostBySlug(slug || '');
```

The post content is then rendered:

```astro
<div class="prose-lg md:prose-xl lg:prose-2xl dark:prose-invert max-w-none blog-content">
  <div set:html={post.content.rendered} />
</div>
```

### Pagination

The blog pagination page (`src/pages/blog/page/[page].astro`) uses the WordPress API to fetch posts for a specific page:

```typescript
export async function getStaticPaths() {
  const totalPages = await getTotalPages(PER_PAGE);
  
  return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => ({
    params: { page: String(page) },
  }));
}

const { page } = Astro.params;
const currentPage = parseInt(page || '1');
const posts = await getAllPosts(currentPage, PER_PAGE);
```

## Customization

### Changing the WordPress Source

To use a different WordPress site as the content source, update the `WORDPRESS_API_URL` in `src/lib/wordpress.ts`:

```typescript
const WORDPRESS_API_URL = 'https://your-wordpress-site.com/wp-json/wp/v2';
```

### Modifying Post Display

To change how posts are displayed, modify the `BlogCard.astro` component for list views or the `[slug].astro` file for single post views.

### Adding Categories and Tags

To add category and tag filtering, you can extend the WordPress API functions to include these parameters:

```typescript
export async function getPostsByCategory(categoryId: number, page = 1, perPage = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed=true&categories=${categoryId}&page=${page}&per_page=${perPage}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching WordPress posts by category:', error);
    return [];
  }
}
```

## Error Handling

The WordPress API functions include error handling to prevent the site from breaking if the WordPress API is unavailable:

1. Each function has a try/catch block to handle network errors
2. Response status is checked with `if (!response.ok)`
3. Default values are returned in case of errors (empty array, null, or 1 for page count)
4. Error messages are logged to the console

## Performance Considerations

1. **Caching**: Consider implementing caching for WordPress API responses to reduce load times
2. **Static Generation**: The site uses Astro's static generation to pre-render blog pages at build time
3. **Pagination**: Posts are fetched in batches to improve performance
4. **Embedded Resources**: The `_embed=true` parameter fetches related resources in a single request

## Future Enhancements

1. **Search Functionality**: Add a search feature that queries the WordPress API
2. **Category/Tag Navigation**: Add filtering by categories and tags
3. **Author Pages**: Create pages for individual authors
4. **Related Posts**: Show related posts based on categories or tags
5. **Comments**: Integrate WordPress comments or a third-party comment system
