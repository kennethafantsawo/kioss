/**
 * @page /robots.txt
 * @description Fichier robots.txt généré automatiquement.
 *
 * Autorise tous les crawlers (Google, Bing, Baidu, Yandex, DuckDuckGo…)
 * et pointe vers le sitemap.xml.
 */

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*', // Tous les robots
        allow: '/',
        disallow: ['/api/', '/_next/', '/icons/', '/manifest.json'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
