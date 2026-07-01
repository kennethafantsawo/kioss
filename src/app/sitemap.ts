/**
 * @page /sitemap.xml
 * @description Sitemap généré automatiquement avec toutes les pharmacies.
 *
 * Next.js 16 : il suffit d'exporter une fonction `default` qui renvoie un
 * tableau d'entrées XML. Le framework s'occupe de la sérialisation et du
 * Content-Type.
 *
 * URLs incluses :
 *   - / (page kiosk)
 *   - /mobile (liste interactive)
 *   - /pharmacie/{slug} × 48 (landing page par pharmacie)
 */

import type { MetadataRoute } from 'next';
import { SCRAPED_PHARMACIES } from '@/server/data/scraped-pharmacies';
import { SITE_URL } from '@/lib/seo-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages principales
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/mobile`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // 48 landing pages par pharmacie
  const pharmacyPages: MetadataRoute.Sitemap = SCRAPED_PHARMACIES.map((p) => ({
    url: `${SITE_URL}/pharmacie/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...mainPages, ...pharmacyPages];
}
