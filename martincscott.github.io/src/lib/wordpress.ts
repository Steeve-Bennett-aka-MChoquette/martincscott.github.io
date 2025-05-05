/**
 * WordPress API utilities
 */

// Use a public WordPress demo site
const WORDPRESS_API_URL = 'https://catapultecommunication.com/wp-json/wp/v2';
// Alternative sources if the above doesn't work:
// 'https://techcrunch.com/wp-json/wp/v2'
// 'https://content.wpvip.com/wp-json/wp/v2'

// Types for WordPress content
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

/**
 * Fetch all posts with pagination support
 */
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

/**
 * Get a single post by slug
 */
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

/**
 * Get total number of pages based on posts per page
 */
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