import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

// Force static export for sitemap

export const dynamic = 'force-static';

const baseUrl = 'https://dogplay.io';

const staticPages = [
  '',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/affiliate-disclosure',
  '/responsible-gambling',
];

const blogPosts = [
  'ipl-2025-betting-guide',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      const path = locale === 'en' ? page : `/${locale}${page}`;
      sitemap.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              `${baseUrl}${l === 'en' ? page : `/${l}${page}`}`,
            ])
          ),
        },
      });
    }

    for (const post of blogPosts) {
      const path = locale === 'en' ? `/blog/${post}` : `/${locale}/blog/${post}`;
      sitemap.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date('2025-01-15'),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              `${baseUrl}${l === 'en' ? `/blog/${post}` : `/${l}/blog/${post}`}`,
            ])
          ),
        },
      });
    }
  }

  return sitemap;
}
