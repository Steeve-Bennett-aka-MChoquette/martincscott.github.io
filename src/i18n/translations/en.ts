/**
 * English Translations
 * @module i18n/translations/en
 */

import type { Translations } from '../types';

export const en: Translations = {
  site: {
    title: 'Martin C Scott',
    description: 'Crafting exceptional digital experiences through UX/UI innovation'
  },

  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    projects: 'Projects',
    contact: 'Contact'
  },

  hero: {
    title: 'Crafting exceptional digital experiences through UX/UI innovation',
    subtitle: 'Leveraging cutting-edge technologies to create intuitive digital products for startups, enterprises, and digital agencies worldwide. Expert in transforming complex challenges into elegant, user-centered solutions.'
  },

  features: {
    title: 'Expertise',
    subtitle: 'Skills and technologies I master',
    items: [
      {
        title: 'Software Development',
        description: 'Experienced in both functional and OOP paradigms across Dart, Python, Java, JavaScript, and TypeScript. Focused on clean architecture and scalable solutions.'
      },
      {
        title: 'Frontend Development',
        description: 'React/NextJS expert with 5+ years of experience. Passionate about UI/UX design and modern web standards using HTML, CSS, and JavaScript frameworks.'
      },
      {
        title: 'Flutter Development',
        description: 'Skilled in building cross-platform mobile applications for Android and iOS using Flutter framework with native performance and responsive design.'
      },
      {
        title: 'WordPress Expertise',
        description: 'Full-stack WordPress developer specializing in custom themes, plugins, and headless implementations with REST API and GraphQL integration.'
      },
      {
        title: 'Vue JS Development',
        description: 'Proficient in Vue 3 with component-based architecture, Vuex/Pinia state management, and modern tooling like Vite and Vue Router.'
      },
      {
        title: 'Docker & Open Source',
        description: 'Containerization expert with Docker and Kubernetes. Active contributor to open source projects with CI/CD pipeline implementation experience.'
      }
    ]
  },

  cta: {
    title: "Let's build something together",
    subtitle: 'Ready to transform your vision into digital reality?',
    button: 'Contact me',
    download: 'Download for free',
    github: 'GitHub repo'
  },

  footer: {
    rights: 'All rights reserved',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service'
  },

  logos: {
    title: 'Technologies I work with'
  },

  blog: {
    title: 'Blog',
    readMore: 'Read more',
    publishedOn: 'Published on',
    backToAll: 'Back to all posts',
    recentPosts: 'Recent Posts',
    postedOn: 'Posted on',
    backToList: 'Back to Blog List'
  },

  projects: {
    title: 'Projects',
    description: 'Explore our latest work and projects.',
    latestWork: 'Our latest Work',
    latestWorkSubtitle: "Discover our recent projects and the innovative solutions we've created for our clients.",
    viewProject: 'View project',
    readMore: 'Read more',
    backToAll: 'Back to all projects',
    noProjects: 'No projects available at the moment. Please check back later.',
    recentProjects: 'Recent Projects',
    viewDetails: 'View Details',
    backToList: 'Back to Project List',
    postedOn: 'Posted on',
    noProjectsFound: 'No projects found',
    checkBackLater: 'Please check back later for new projects.',
    projectNotFound: 'Project Not Found',
    projectNotFoundDescription: "The project you're looking for could not be found.",
    backToProjects: 'Back to Projects'
  },

  pagination: {
    prev: 'Previous',
    next: 'Next',
    page: 'Page'
  },

  contact: {
    title: 'Contact me',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send',
    success: 'Your message has been sent successfully!',
    error: 'An error occurred. Please try again.',
    letsCollaborate: "Let's Collaborate",
    collaborateText: 'Ready to discuss your digital transformation project or need expert UX/UI guidance? Reach out through any of these channels to start the conversation.'
  },

  about: {
    title: 'About',
    subtitle: 'Learn more about me and my work'
  },

  notFound: {
    title: 'Page not found',
    message: "The page you are looking for doesn't exist or has been moved.",
    button: 'Back to home'
  },

  auth: {
    login: 'Login',
    signup: 'Sign\u00A0Up', // Non-breaking space
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to login',
    enterEmail: 'Enter your registered email address to recover access',
    alreadyHaveAccount: 'Already have an account?',
    clientPortal: 'Client Portal Login',
    newToPortal: 'New to the platform?',
    createAccount: 'Create Account',
    needAssistance: 'Need Account Assistance?',
    orLoginWith: 'Or login with'
  },

  secure: {
    title: 'Secure Dashboard',
    welcome: 'Welcome',
    logout: 'Logout',
    loading: 'Loading...',
    authError: 'Authentication error',
    logoutError: 'Error logging out',
    profile: 'Profile',
    viewProfile: 'View Profile'
  },

  profile: {
    title: 'My Profile',
    personalInfo: 'Personal Information',
    email: 'Email',
    displayName: 'Display Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    bio: 'Bio',
    avatar: 'Profile Picture',
    changeAvatar: 'Change Picture',
    save: 'Save Changes',
    saving: 'Saving...',
    saved: 'Profile saved!',
    saveError: 'Error saving profile',
    backToDashboard: 'Back to Dashboard',
    accountInfo: 'Account Information',
    provider: 'Sign-in Method',
    createdAt: 'Member Since',
    lastSignIn: 'Last Sign In'
  }
} as const;

export default en;
