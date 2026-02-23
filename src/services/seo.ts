/**
 * SEO Service
 * Manages meta tags, structured data, and SEO utilities
 */

export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  author?: string;
}

const defaultSEO: SEOConfig = {
  title: 'KebunKU - Digital Garden Diary',
  description: 'Track your garden journey, monitor plants, and log harvests with KebunKU - your personal digital garden companion.',
  canonicalUrl: 'https://kebunqu.vercel.app',
  ogImage: 'https://kebunqu.vercel.app/og-image.jpg',
  type: 'website',
  keywords: ['garden', 'plants', 'harvest', 'agriculture', 'gardening', 'farm'],
  author: 'KebunKU Team',
};

/**
 * Update document meta tags
 */
export function updateMetaTags(config: Partial<SEOConfig>): void {
  const seo = { ...defaultSEO, ...config };

  // Title
  document.title = seo.title;
  updateMeta('title', seo.title);

  // Description
  updateMeta('description', seo.description);

  // Keywords
  if (seo.keywords) {
    updateMeta('keywords', seo.keywords.join(', '));
  }

  // Author
  if (seo.author) {
    updateMeta('author', seo.author);
  }

  // Canonical URL
  if (seo.canonicalUrl) {
    updateCanonical(seo.canonicalUrl);
  }

  // Open Graph tags
  updateMeta('og:title', seo.title, 'property');
  updateMeta('og:description', seo.description, 'property');
  updateMeta('og:type', seo.type || 'website', 'property');
  updateMeta('og:url', seo.canonicalUrl || window.location.href, 'property');
  if (seo.ogImage) {
    updateMeta('og:image', seo.ogImage, 'property');
  }

  // Twitter Card tags
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', seo.title);
  updateMeta('twitter:description', seo.description);
  if (seo.ogImage) {
    updateMeta('twitter:image', seo.ogImage);
  }

  // Robots
  updateMeta('robots', 'index, follow');
}

/**
 * Update a single meta tag
 */
function updateMeta(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
  let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

/**
 * Update canonical URL
 */
function updateCanonical(url: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', url);
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(data: StructuredData): string {
  return JSON.stringify(data);
}

/**
 * Add structured data to document head
 */
export function addStructuredData(data: StructuredData): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = generateStructuredData(data);
  document.head.appendChild(script);
}

/**
 * Remove all structured data scripts
 */
export function clearStructuredData(): void {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach(script => script.remove());
}

/**
 * Structured data types for KebunKU
 */
export interface WebSiteStructuredData {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface OrganizationStructuredData {
  '@context': string;
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export interface SoftwareAppStructuredData {
  '@context': string;
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  description: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
  };
}

export interface BreadcrumbListStructuredData {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export type StructuredData = 
  | WebSiteStructuredData
  | OrganizationStructuredData
  | SoftwareAppStructuredData
  | BreadcrumbListStructuredData;

/**
 * Pre-built structured data generators for KebunKU
 */
export const structuredData = {
  website: (url = 'https://kebunqu.vercel.app'): WebSiteStructuredData => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KebunKU',
    url,
    description: 'Digital Garden Diary - Track your garden journey',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }),

  organization: (): OrganizationStructuredData => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KebunKU',
    url: 'https://kebunqu.vercel.app',
    logo: 'https://kebunqu.vercel.app/logo.png',
    sameAs: [
      'https://facebook.com/kebunqu',
      'https://twitter.com/kebunqu',
      'https://instagram.com/kebunqu',
    ],
  }),

  softwareApp: (): SoftwareAppStructuredData => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'KebunKU',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web, iOS, Android',
    description: 'Digital Garden Diary for tracking plants, harvests, and gardening activities',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>): BreadcrumbListStructuredData => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
};
