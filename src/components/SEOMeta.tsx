import { useEffect } from 'react';
import {
  updateMetaTags,
  addStructuredData,
  clearStructuredData,
  structuredData,
  type SEOConfig,
  type StructuredData,
} from '../services/seo';

interface SEOMetaProps extends Partial<SEOConfig> {
  structuredData?: StructuredData | StructuredData[];
}

/**
 * Component for managing SEO meta tags and structured data
 * Drop-in replacement for react-helmet style usage
 */
export function SEOMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  type,
  keywords,
  author,
  structuredData,
}: SEOMetaProps) {
  useEffect(() => {
    // Update meta tags
    updateMetaTags({
      title,
      description,
      canonicalUrl,
      ogImage,
      type,
      keywords,
      author,
    });

    // Add structured data
    if (structuredData) {
      const data = Array.isArray(structuredData) ? structuredData : [structuredData];
      data.forEach(d => addStructuredData(d));
    }

    // Cleanup on unmount
    return () => {
      clearStructuredData();
    };
  }, [title, description, canonicalUrl, ogImage, type, keywords, author, structuredData]);

  return null;
}

/**
 * Pre-configured SEO components for common pages
 */
export const SEO = {
  Home: () => (
    <SEOMeta
      title="KebunKU - Digital Garden Diary"
      description="Track your garden journey, monitor plants, and log harvests with KebunKU."
      canonicalUrl="https://kebunqu.vercel.app"
      keywords={['garden', 'plants', 'harvest', 'gardening', 'digital diary']}
      structuredData={[
        structuredData.website(),
        structuredData.softwareApp(),
      ]}
    />
  ),
  About: () => (
    <SEOMeta
      title="About - KebunKU"
      description="Learn about KebunKU, your personal digital garden companion."
      canonicalUrl="https://kebunqu.vercel.app/about"
      keywords={['about', 'kebunqu', 'garden app']}
    />
  ),
  Features: () => (
    <SEOMeta
      title="Features - KebunKU"
      description="Discover KebunKU features: plant tracking, harvest logs, activity monitoring."
      canonicalUrl="https://kebunqu.vercel.app/features"
      keywords={['features', 'plant tracking', 'harvest log', 'garden tools']}
    />
  ),
  Login: () => (
    <SEOMeta
      title="Login - KebunKU"
      description="Sign in to your KebunKU account to access your garden diary."
      canonicalUrl="https://kebunqu.vercel.app/login"
      keywords={['login', 'sign in', 'garden account']}
    />
  ),
  Dashboard: () => (
    <SEOMeta
      title="Dashboard - KebunKU"
      description="View your garden overview, recent activities, and plant status."
      canonicalUrl="https://kebunqu.vercel.app/dashboard"
      keywords={['dashboard', 'garden overview', 'plant status']}
    />
  ),
};
