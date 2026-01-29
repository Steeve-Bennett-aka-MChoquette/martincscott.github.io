/**
 * French Translations
 * @module i18n/translations/fr
 */

import type { Translations } from '../types';

export const fr: Translations = {
  site: {
    title: 'Martin C Scott',
    description: "Création d'expériences numériques exceptionnelles grâce à l'innovation UX/UI"
  },

  nav: {
    home: 'Accueil',
    about: 'À propos',
    blog: 'Blog',
    projects: 'Projets',
    contact: 'Contact'
  },

  hero: {
    title: "Création d'expériences numériques exceptionnelles grâce à l'innovation UX/UI",
    subtitle: "Utilisation de technologies de pointe pour créer des produits numériques intuitifs pour les startups, les entreprises et les agences numériques du monde entier. Expert dans la transformation de défis complexes en solutions élégantes centrées sur l'utilisateur."
  },

  features: {
    title: 'Expertise',
    subtitle: 'Compétences et technologies que je maîtrise',
    items: [
      {
        title: 'Développement Logiciel',
        description: "Expérimenté en programmation fonctionnelle et orientée objet avec Dart, Python, Java, JavaScript et TypeScript. Focus sur l'architecture propre et les solutions évolutives."
      },
      {
        title: 'Développement Frontend',
        description: "Expert React/NextJS avec plus de 5 ans d'expérience. Passionné par le design UI/UX et les standards web modernes avec HTML, CSS et les frameworks JavaScript."
      },
      {
        title: 'Développement Flutter',
        description: "Compétent dans la création d'applications mobiles multiplateformes pour Android et iOS avec le framework Flutter, offrant des performances natives et un design responsive."
      },
      {
        title: 'Expertise WordPress',
        description: 'Développeur WordPress full-stack spécialisé dans les thèmes personnalisés, les plugins et les implémentations headless avec intégration REST API et GraphQL.'
      },
      {
        title: 'Développement Vue JS',
        description: 'Maîtrise de Vue 3 avec architecture basée sur les composants, gestion d\'état Vuex/Pinia et outils modernes comme Vite et Vue Router.'
      },
      {
        title: 'Docker & Open Source',
        description: 'Expert en conteneurisation avec Docker et Kubernetes. Contributeur actif aux projets open source avec expérience en implémentation de pipelines CI/CD.'
      }
    ]
  },

  cta: {
    title: 'Construisons quelque chose ensemble',
    subtitle: 'Prêt à transformer votre vision en réalité numérique?',
    button: 'Contactez-moi',
    download: 'Télécharger gratuitement',
    github: 'Dépôt GitHub'
  },

  footer: {
    rights: 'Tous droits réservés',
    privacy: 'Politique de confidentialité',
    terms: "Conditions d'utilisation"
  },

  logos: {
    title: 'Technologies avec lesquelles je travaille'
  },

  blog: {
    title: 'Blog',
    readMore: 'Lire la suite',
    publishedOn: 'Publié le',
    backToAll: 'Retour à tous les articles',
    recentPosts: 'Articles Récents',
    postedOn: 'Publié le',
    backToList: 'Retour à la Liste du Blog'
  },

  projects: {
    title: 'Projets',
    description: 'Découvrez nos derniers travaux et projets.',
    latestWork: 'Nos dernières réalisations',
    latestWorkSubtitle: 'Découvrez nos projets récents et les solutions innovantes que nous avons créées pour nos clients.',
    viewProject: 'Voir le projet',
    readMore: 'En savoir plus',
    backToAll: 'Retour à tous les projets',
    noProjects: 'Aucun projet disponible pour le moment. Revenez plus tard.',
    recentProjects: 'Projets Récents',
    viewDetails: 'Voir les Détails',
    backToList: 'Retour à la Liste des Projets',
    postedOn: 'Publié le',
    noProjectsFound: 'Aucun projet trouvé',
    checkBackLater: 'Veuillez revenir plus tard pour de nouveaux projets.',
    projectNotFound: 'Projet non trouvé',
    projectNotFoundDescription: "Le projet que vous recherchez n'a pas été trouvé.",
    backToProjects: 'Retour aux Projets'
  },

  pagination: {
    prev: 'Précédent',
    next: 'Suivant',
    page: 'Page'
  },

  contact: {
    title: 'Contactez-moi',
    name: 'Nom',
    email: 'Courriel',
    message: 'Message',
    send: 'Envoyer',
    success: 'Votre message a été envoyé avec succès!',
    error: 'Une erreur est survenue. Veuillez réessayer.',
    letsCollaborate: 'Collaborons',
    collaborateText: "Prêt à discuter de votre projet de transformation numérique ou besoin de conseils d'expert en UX/UI? Contactez-moi par l'un de ces canaux pour commencer la conversation."
  },

  about: {
    title: 'À propos',
    subtitle: 'En savoir plus sur moi et mon travail'
  },

  notFound: {
    title: 'Page non trouvée',
    message: "La page que vous recherchez n'existe pas ou a été déplacée.",
    button: "Retour à l'accueil"
  },

  auth: {
    login: 'Connexion',
    signup: "S'inscrire",
    email: 'Courriel',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié?',
    resetPassword: 'Réinitialiser le mot de passe',
    sendResetLink: 'Envoyer le lien de réinitialisation',
    backToLogin: 'Retour à la connexion',
    enterEmail: "Entrez votre adresse email enregistrée pour récupérer l'accès",
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    clientPortal: 'Connexion au portail client',
    newToPortal: 'Nouveau sur la plateforme?',
    createAccount: 'Créer un compte',
    needAssistance: "Besoin d'aide avec votre compte?",
    orLoginWith: 'Ou connectez-vous avec'
  },

  secure: {
    title: 'Tableau de bord sécurisé',
    welcome: 'Bienvenue',
    logout: 'Se déconnecter',
    loading: 'Chargement...',
    authError: "Erreur d'authentification",
    logoutError: 'Erreur lors de la déconnexion',
    profile: 'Profil',
    viewProfile: 'Voir le profil'
  },

  profile: {
    title: 'Mon Profil',
    personalInfo: 'Informations personnelles',
    email: 'Courriel',
    displayName: "Nom d'affichage",
    firstName: 'Prénom',
    lastName: 'Nom',
    bio: 'Biographie',
    avatar: 'Photo de profil',
    changeAvatar: 'Changer la photo',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    saved: 'Profil enregistré!',
    saveError: "Erreur lors de l'enregistrement",
    backToDashboard: 'Retour au tableau de bord',
    accountInfo: 'Informations du compte',
    provider: 'Méthode de connexion',
    createdAt: 'Membre depuis',
    lastSignIn: 'Dernière connexion'
  }
} as const;

export default fr;
