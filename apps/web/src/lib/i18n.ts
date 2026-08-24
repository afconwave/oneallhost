export type Locale = 'en' | 'fr';

export interface Translations {
  nav: {
    domains: string;
    rentals: string;
    pricing: string;
    hosting: string;
    about: string;
    dashboard: string;
    signin: string;
  };
  dashboard: {
    overview: string;
    domains: string;
    rentals: string;
    hosting: string;
    billing: string;
    support: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    momoNotice: string;
  };
  pillars: {
    domainsTitle: string;
    domainsDesc: string;
    rentalsTitle: string;
    rentalsDesc: string;
    hostingTitle: string;
    hostingDesc: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    tldHeader: string;
    priceHeader: string;
    featuresHeader: string;
    actionHeader: string;
    toggleCurrency: string;
  };
  rentals: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      domains: 'Domain Registration',
      rentals: 'Subdomain Rentals',
      pricing: 'Pricing & Rates',
      hosting: 'Cloud Hosting',
      about: 'About Oneallhost',
      dashboard: 'Client Portal',
      signin: 'Sign In',
    },
    dashboard: {
      overview: 'Overview',
      domains: 'My Domains',
      rentals: 'Subdomain Leases',
      hosting: 'Cloud Hosting',
      billing: 'Billing & Invoices',
      support: 'Support Center',
    },
    hero: {
      badge: 'ICANN Accredited Infrastructure • CEMAC & Global',
      titleLine1: 'The Direct Way to',
      titleHighlight: 'Register Domains',
      titleLine2: '& Lease Subdomains.',
      subtitle:
        'Instant domain registration, short-term project leasing, and managed cloud hosting. Native MTN Mobile Money, Orange Money, Card, and Crypto settlement.',
      searchPlaceholder: 'Search your domain (e.g. business.cm, mybrand.com)...',
      searchButton: 'Check Availability',
      momoNotice: 'Direct API Mobile Money: Instant automated activation with zero external redirects.',
    },
    pillars: {
      domainsTitle: '1. ICANN Domain Registration',
      domainsDesc:
        'Full ownership of .com, .cm, .africa, and 400+ TLDs with automated DNS management, 60-day transfer locks, and free WHOIS privacy.',
      rentalsTitle: '2. Short-Term Subdomain Rentals',
      rentalsDesc:
        'Lease staging subdomains for 24h, 72h, or 7 days. 100% of rental payments count as a direct rebate if you purchase the full domain.',
      hostingTitle: '3. Managed Cloud Hosting (Waitlist)',
      hostingDesc:
        'Ultra-low latency SSD NVMe cloud infrastructure optimized for Central and West Africa, featuring automated SSL and daily backups.',
    },
    pricing: {
      title: 'Transparent TLD Registration Rates',
      subtitle:
        'All domain registrations include free WHOIS identity masking and automatic DNS zone configuration.',
      tldHeader: 'TLD Extension',
      priceHeader: 'Annual Registration',
      featuresHeader: 'Included Features',
      actionHeader: 'Action',
      toggleCurrency: 'Switch Currency (USD / XAF)',
    },
    rentals: {
      badge: 'Subdomain Leasing Protocol',
      title: 'Deploy Instantly. Zero Upfront Risk.',
      subtitle:
        'How Oneallhost flexible short-term leases empower event organizers, hackathons, and agile developers.',
      step1Title: 'Select Name & Duration',
      step1Desc:
        'Pick any available prefix and lease for 24 hours ($1.99), 72 hours ($3.99), or 7 days ($7.99).',
      step2Title: 'Instant DNS Routing',
      step2Desc:
        'Point your CNAME or A records immediately to Vercel, Netlify, AWS, or your local server.',
      step3Title: 'Convert with 100% Credit',
      step3Desc:
        'Convert to permanent domain ownership anytime with full rental price rebated automatically.',
    },
  },
  fr: {
    nav: {
      domains: 'Enregistrement de Domaine',
      rentals: 'Location de Sous-domaines',
      pricing: 'Tarifs & Extensions',
      hosting: 'Hébergement Cloud',
      about: 'À Propos de Oneallhost',
      dashboard: 'Espace Client',
      signin: 'Connexion',
    },
    dashboard: {
      overview: 'Vue d’ensemble',
      domains: 'Mes Domaines',
      rentals: 'Baux Sous-domaines',
      hosting: 'Hébergement Cloud',
      billing: 'Facturation & Reçus',
      support: 'Centre d’Assistance',
    },
    hero: {
      badge: 'Infrastructure Accréditée ICANN • CEMAC & International',
      titleLine1: 'La Voie Directe pour',
      titleHighlight: 'Enregistrer vos Domaines',
      titleLine2: '& Louer des Sous-domaines.',
      subtitle:
        'Enregistrement instantané de domaines, location à court terme et hébergement cloud géré. Règlement natif par MTN Mobile Money, Orange Money, Carte et Crypto.',
      searchPlaceholder: 'Recherchez votre domaine (ex. entreprise.cm, marque.com)...',
      searchButton: 'Vérifier la Disponibilité',
      momoNotice: 'Mobile Money par API Directe: Activation automatisée sans redirection externe.',
    },
    pillars: {
      domainsTitle: '1. Enregistrement de Domaines ICANN',
      domainsDesc:
        'Propriété intégrale sur .cm, .com, .africa et 400+ extensions avec gestion DNS automatisée, verrouillage de transfert et protection WHOIS gratuite.',
      rentalsTitle: '2. Location Temporaire de Sous-domaines',
      rentalsDesc:
        'Louez des sous-domaines pour 24h, 72h ou 7 jours. 100% du montant loué est déduit sous forme de remise si vous achetez le domaine définitif.',
      hostingTitle: '3. Hébergement Cloud Géré (Liste d’attente)',
      hostingDesc:
        'Infrastructure cloud SSD NVMe à très faible latence optimisée pour l’Afrique Centrale et de l’Ouest, avec certificats SSL et sauvegardes quotidiennes.',
    },
    pricing: {
      title: 'Tarification Transparente des Extensions',
      subtitle:
        'Tous les enregistrements comprennent la protection d’identité WHOIS gratuite et la configuration automatique des zones DNS.',
      tldHeader: 'Extension TLD',
      priceHeader: 'Enregistrement Annuel',
      featuresHeader: 'Fonctionnalités Incluses',
      actionHeader: 'Action',
      toggleCurrency: 'Changer de Devise (USD / XAF)',
    },
    rentals: {
      badge: 'Protocole de Location de Sous-domaines',
      title: 'Déployez Instantanément. Zéro Risque.',
      subtitle:
        'Comment les baux à court terme de Oneallhost permettent aux organisateurs d’événements et développeurs de tester sans engagement.',
      step1Title: 'Sélectionnez le Nom & la Durée',
      step1Desc:
        'Choisissez votre préfixe et louez pour 24 heures (1 225 FCFA), 72 heures (2 455 FCFA) ou 7 jours (4 920 FCFA).',
      step2Title: 'Routage DNS Immédiat',
      step2Desc:
        'Pointez instantanément vos enregistrements CNAME ou A vers Vercel, Netlify, AWS ou votre propre serveur.',
      step3Title: 'Convertissez avec 100% de Crédit',
      step3Desc:
        'Passez à la propriété définitive à tout moment avec remboursement intégral du loyer appliqué automatiquement.',
    },
  },
};
