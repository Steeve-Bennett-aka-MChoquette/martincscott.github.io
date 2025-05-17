/**
 * WordPress API utilities
 */

// WordPress API URLs for different sites
const BLOG_API_URL = 'https://wpdb.martincscott.com/wp-json/wp/v2';
const PROJECTS_API_URL = 'https://wpdb.martincscott.com/wp-json/wp/v2';

// Types for WordPress content
// Blog post interface
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
  meta: {
    slim_seo: {
      title: string;
      description: string;
      og_image: string;
    };
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      alt_text?: string;
      media_details?: {
        sizes?: {
          full?: {
            source_url?: string;
          };
          medium?: {
            source_url?: string;
          };
        };
      };
      guid?: {
        rendered?: string;
      };
    }>;
    author?: Array<{
      name: string;
      avatar_urls: Record<string, string>;
    }>;
  };
}

// Project interface
export interface WordPressProject {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  acf: {
    content: string;
    image: string;
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
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string, lang = 'fr'): Promise<WordPressPost | null> {
  try {
    const url = `${BLOG_API_URL}/posts?_embed=wp:featuredmedia&slug=${slug}&lang=${lang}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    
    const posts = await response.json();
    
    if (posts.length === 0) {
      return null;
    }
    
    const post = posts[0];
    
    // If no featured media found but we have a featured_media ID, try direct fetch
    if (post.featured_media && (!post._embedded || !post._embedded['wp:featuredmedia'] || !post._embedded['wp:featuredmedia'][0]?.source_url)) {
      try {
        const mediaUrl = `${BLOG_API_URL}/media/${post.featured_media}`;
        const mediaResponse = await fetch(mediaUrl);
        
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          
          // Ensure _embedded exists
          if (!post._embedded) {
            post._embedded = {};
          }
          
          // Add the media data
          post._embedded['wp:featuredmedia'] = [mediaData];
        }
      } catch (mediaError) {
        console.error(`Error fetching media:`, mediaError);
      }
    }
    
    return post;
  } catch (error) {
    console.error(`Error fetching post:`, error);
    return null;
  }
}

/**
 * Fetch all blog posts with pagination support
 */
export async function getAllPosts(page = 1, perPage = 10, lang = 'fr'): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${BLOG_API_URL}/posts?_embed=wp:featuredmedia&page=${page}&per_page=${perPage}&lang=${lang}`
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
 * Get total number of blog pages based on posts per page
 */
export async function getTotalPages(perPage = 10, lang = 'fr'): Promise<number> {
  try {
    const response = await fetch(
      `${BLOG_API_URL}/posts?per_page=${perPage}&lang=${lang}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    // WordPress returns total pages in headers
    const totalPages = Number(response.headers.get('X-WP-TotalPages') || '1');
    return totalPages;
  } catch (error) {
    console.error('Error fetching total pages');
    return 1;
  }
}

/**
 * Fetch all projects with pagination support
 */
export async function getAllProjects(page = 1, perPage = 10, lang = 'fr'): Promise<WordPressProject[]> {
  try {
    // Request ACF fields with acf=true parameter
    const url = `${PROJECTS_API_URL}/projet?_embed=true&acf=true&page=${page}&per_page=${perPage}&lang=${lang}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching WordPress projects');
    return [];
  }
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string, lang = 'fr'): Promise<WordPressProject | null> {
  try {
    // Request ACF fields with acf=true parameter
    const url = `${PROJECTS_API_URL}/projet?_embed=true&acf=true&slug=${slug}&lang=${lang}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }
    
    const projects = await response.json();
    return projects.length > 0 ? projects[0] : null;
  } catch (error) {
    console.error(`Error fetching project`);
    return null;
  }
}

/**
 * Get total number of project pages based on projects per page
 */
export async function getTotalProjectPages(perPage = 10, lang = 'fr'): Promise<number> {
  try {
    const response = await fetch(
      `${PROJECTS_API_URL}/projet?per_page=${perPage}&lang=${lang}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    
    // WordPress returns total pages in headers
    const totalPages = Number(response.headers.get('X-WP-TotalPages') || '1');
    return totalPages;
  } catch (error) {
    console.error('Error fetching total project pages');
    return 1;
  }
}

/**
 * Get translations for a specific post
 * This is useful for creating language switcher links
 */
export async function getPostTranslations(postId: number): Promise<Record<string, string>> {
  try {
    // Polylang exposes translations via the REST API
    const response = await fetch(
      `${BLOG_API_URL}/posts/${postId}/translations`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post translations: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching post translations');
    return {};
  }
}

/**
 * Get translations for a specific project
 * This is useful for creating language switcher links
 */
export async function getProjectTranslations(projectId: number): Promise<Record<string, string>> {
  try {
    // Polylang exposes translations via the REST API
    const response = await fetch(
      `${PROJECTS_API_URL}/projet/${projectId}/translations`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch project translations: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching project translations');
    return {};
  }
}

/**
 * Helper function to extract featured image URL from WP post
 */
export function extractFeaturedImageUrl(post: WordPressPost): string | null {
  if (!post) return null;
  
  // Standard path
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  
  // Alternate path sometimes used in WordPress
  if (post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full?.source_url) {
    return post._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
  }
  
  // Try medium size
  if (post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url) {
    return post._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
  }
  
  // Some WP setups use guid for image URL
  if (post._embedded?.['wp:featuredmedia']?.[0]?.guid?.rendered) {
    return post._embedded['wp:featuredmedia'][0].guid.rendered;
  }
  
  // Check for SEO image from Slim SEO
  if (post.meta?.slim_seo?.og_image) {
    return post.meta.slim_seo.og_image;
  }
  
  return null;
}