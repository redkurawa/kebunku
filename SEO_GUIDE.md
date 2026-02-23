# SEO Guide for KebunKU

This guide explains how to use the SEO indexing and mapping features in KebunKU.

## Files Overview

### Static Files (in `/public`)

| File | Purpose |
|------|---------|
| `robots.txt` | Controls search engine crawler access |
| `sitemap.xml` | Lists all public pages for search engines |
| `site.webmanifest` | PWA manifest for better mobile indexing |

### Code Files (in `/src`)

| File | Purpose |
|------|---------|
| `services/seo.ts` | Core SEO service with meta tags & structured data |
| `hooks/useSEO.ts` | React hook for SEO management |
| `components/SEOMeta.tsx` | Component-based SEO for pages |

## Usage

### Option 1: Using the `useSEO` Hook (Recommended)

```tsx
import { useSEO, seoPresets } from './hooks';

function MyPage() {
  useSEO({
    title: 'My Plants - KebunKU',
    description: 'Manage and track all your plants',
    keywords: ['plants', 'garden'],
    canonicalUrl: 'https://kebunku.app/plants',
  });

  return <div>...</div>;
}
```

Or use presets:
```tsx
import { useSEO, seoPresets } from './hooks';

function HomePage() {
  useSEO(seoPresets.home);
  return <div>...</div>;
}
```

### Option 2: Using the `SEOMeta` Component

```tsx
import { SEOMeta } from './components';

function MyPage() {
  return (
    <>
      <SEOMeta
        title="My Plants - KebunKU"
        description="Manage and track all your plants"
        keywords={['plants', 'garden']}
      />
      <div>...</div>
    </>
  );
}
```

### Option 3: Using Pre-configured SEO Components

```tsx
import { SEO } from './components';

function HomePage() {
  return (
    <>
      <SEO.Home />
      <div>...</div>
    </>
  );
}
```

## Structured Data (JSON-LD)

Add structured data for rich search results:

```tsx
import { useSEO } from './hooks';
import { structuredData } from './services/seo';

function AboutPage() {
  useSEO({
    title: 'About - KebunKU',
    structuredData: [
      structuredData.organization(),
      structuredData.breadcrumb([
        { name: 'Home', url: 'https://kebunku.app' },
        { name: 'About', url: 'https://kebunku.app/about' },
      ]),
    ],
  });

  return <div>...</div>;
}
```

## Available Structured Data Types

- `structuredData.website()` - Website schema
- `structuredData.organization()` - Organization schema
- `structuredData.softwareApp()` - Software application schema
- `structuredData.breadcrumb(items)` - Breadcrumb navigation

## Updating sitemap.xml

For dynamic content (plants, harvests), update `sitemap.xml` during build:

```ts
// scripts/generate-sitemap.ts
import { writeFileSync } from 'fs';
import { plants } from './data';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${plants.map(p => `
  <url>
    <loc>https://kebunku.app/plants/${p.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
```

## Best Practices

1. **Unique Titles**: Each page should have a unique, descriptive title
2. **Meta Descriptions**: Keep between 150-160 characters
3. **Canonical URLs**: Always set for pages that can be accessed via multiple URLs
4. **Open Graph**: Include og:image for social sharing (1200x630px recommended)
5. **Structured Data**: Use JSON-LD for rich snippets in search results
6. **Mobile-Friendly**: Ensure responsive design (already handled)
7. **Page Speed**: Optimize images and code splitting (configured in vite.config.ts)

## Testing

Use these tools to test SEO:

- [Google Search Console](https://search.google.com/search-console)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## Deployment Checklist

- [ ] Update `sitemap.xml` with all public URLs
- [ ] Verify `robots.txt` allows desired crawling
- [ ] Set correct canonical URLs in meta tags
- [ ] Add og:image for social sharing
- [ ] Submit sitemap to Google Search Console
- [ ] Test structured data with Rich Results Test
