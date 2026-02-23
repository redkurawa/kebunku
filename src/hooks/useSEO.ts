import { useEffect } from 'react';
import {
  updateMetaTags,
  addStructuredData,
  clearStructuredData,
  type SEOConfig,
  type StructuredData,
} from '../services/seo';

interface UseSEOOOptions extends Partial<SEOConfig> {
  structuredData?: StructuredData | StructuredData[];
  clearOnUnmount?: boolean;
}

/**
 * React hook for managing SEO meta tags and structured data
 */
export function useSEO(options: UseSEOOOptions = {}) {
  const {
    clearOnUnmount = true,
    structuredData,
    ...seoConfig
  } = options;

  useEffect(() => {
    // Update meta tags on mount or when config changes
    updateMetaTags(seoConfig);

    // Add structured data if provided
    if (structuredData) {
      const data = Array.isArray(structuredData) ? structuredData : [structuredData];
      data.forEach(d => addStructuredData(d));
    }

    // Cleanup on unmount
    return () => {
      if (clearOnUnmount) {
        clearStructuredData();
      }
    };
  }, [structuredData, clearOnUnmount, ...Object.values(seoConfig)]);
}

/**
 * Pre-configured SEO presets for common pages
 */
export const seoPresets = {
  home: {
    title: 'KebunKU - Digital Garden Diary',
    description: 'Track your garden journey, monitor plants, and log harvests with KebunKU.',
    keywords: ['garden', 'plants', 'harvest', 'gardening', 'digital diary'],
    canonicalUrl: 'https://kebunqu.vercel.app',
  },
  about: {
    title: 'About - KebunKU',
    description: 'Learn about KebunKU, your personal digital garden companion.',
    keywords: ['about', 'kebunqu', 'garden app'],
    canonicalUrl: 'https://kebunqu.vercel.app/about',
  },
  features: {
    title: 'Features - KebunKU',
    description: 'Discover KebunKU features: plant tracking, harvest logs, activity monitoring.',
    keywords: ['features', 'plant tracking', 'harvest log', 'garden tools'],
    canonicalUrl: 'https://kebunqu.vercel.app/features',
  },
  login: {
    title: 'Login - KebunKU',
    description: 'Sign in to your KebunKU account to access your garden diary.',
    keywords: ['login', 'sign in', 'garden account'],
    canonicalUrl: 'https://kebunqu.vercel.app/login',
  },
  dashboard: {
    title: 'Dashboard - KebunKU',
    description: 'View your garden overview, recent activities, and plant status.',
    keywords: ['dashboard', 'garden overview', 'plant status'],
    canonicalUrl: 'https://kebunqu.vercel.app/dashboard',
  },
  plants: {
    title: 'My Plants - KebunKU',
    description: 'Manage and track all your plants in one place.',
    keywords: ['plants', 'plant management', 'garden plants'],
    canonicalUrl: 'https://kebunqu.vercel.app/plants',
  },
  harvests: {
    title: 'Harvest Log - KebunKU',
    description: 'Track your harvest history and garden productivity.',
    keywords: ['harvest', 'yield', 'garden production'],
    canonicalUrl: 'https://kebunqu.vercel.app/harvests',
  },
};
