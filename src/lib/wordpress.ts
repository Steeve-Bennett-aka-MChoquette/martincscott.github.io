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
 * Fetch all blog posts with pagination support
 */
export async function getAllPosts(page = 1, perPage = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${BLOG_API_URL}/posts?_embed=true&page=${page}&per_page=${perPage}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching WordPress posts');
    return [];
  }
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${BLOG_API_URL}/posts?_embed=true&slug=${slug}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    
    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Error fetching post`);
    return null;
  }
}

/**
 * Get total number of blog pages based on posts per page
 */
export async function getTotalPages(perPage = 10): Promise<number> {
  try {
    const response = await fetch(
      `${BLOG_API_URL}/posts?per_page=${perPage}`
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
export async function getAllProjects(page = 1, perPage = 10): Promise<WordPressProject[]> {
  try {
    // Request ACF fields with acf=true parameter
    const url = `${PROJECTS_API_URL}/projet?_embed=true&acf=true&page=${page}&per_page=${perPage}`;
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
export async function getProjectBySlug(slug: string): Promise<WordPressProject | null> {
  try {
    // Request ACF fields with acf=true parameter
    const url = `${PROJECTS_API_URL}/projet?_embed=true&acf=true&slug=${slug}`;
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
export async function getTotalProjectPages(perPage = 10): Promise<number> {
  try {
    const response = await fetch(
      `${PROJECTS_API_URL}/projet?per_page=${perPage}`
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
