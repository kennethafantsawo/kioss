/**
 * @page /mobile
 * @description Version mobile interactive de l&apos;application.
 *
 * SERVER-SIDE RENDERED (SSR) — toutes les pharmacies sont pré-rendues dans le
 * HTML pour que Google puisse les indexer. Le client component gère ensuite
 * la recherche et l&apos;interactivité.
 *
 * Détection automatique :
 *   - Mobile (iPhone, Android, etc.) accédant à `/` → redirigé ici.
 *   - Sur desktop, on garde la page kiosk `/` par défaut.
 */

import type { Metadata } from 'next';
import { SCRAPED_PHARMACIES } from '@/server/data/scraped-pharmacies';
import { MobilePharmaciesExplorer } from '@/components/pharmacy/mobile-pharmacies-explorer';
import { JsonLd } from '@/components/seo/json-ld';
import { pharmacyListJsonLd, breadcrumbJsonLd } from '@/lib/structured-data';
import {
  SITE_NAME,
  SITE_URL,
  canonicalUrl,
  buildOpenGraph,
  buildTwitterCard,
} from '@/lib/seo-config';

export const metadata: Metadata = {
  title:
    'Pharmacies de garde au Togo — 212 pharmacies, appel, SMS, WhatsApp, Maps',
  description:
    'Liste complète des 212 pharmacies de garde au Togo (Lomé). Numéros de téléphone, adresses, appel direct, SMS, WhatsApp et itinéraire Google Maps. Service gratuit 24h/24.',
  keywords: [
    'pharmacie de garde Togo',
    'pharmacie de garde Lomé',
    'pharmacie 24h Togo',
    'pharmacie nuit Lomé',
    'pharmacie urgence Togo',
    'appeler pharmacie Togo',
    'pharmacie WhatsApp Togo',
    'pharmacie ouverte weekend Togo',
    'annuaire pharmacie Togo',
    'numéro pharmacie garde Lomé',
  ],
  alternates: {
    canonical: canonicalUrl('/mobile'),
  },
  openGraph: buildOpenGraph({
    title:
      'Pharmacies de garde au Togo — 212 pharmacies, appel, SMS, WhatsApp, Maps',
    description:
      'Liste complète des 212 pharmacies de garde au Togo. Coordonnées, appel direct, SMS, WhatsApp et Google Maps. Gratuit 24h/24.',
    url: canonicalUrl('/mobile'),
  }),
  twitter: buildTwitterCard({
    title:
      'Pharmacies de garde au Togo — 212 pharmacies, appel, SMS, WhatsApp, Maps',
    description:
      'Liste complète des 212 pharmacies de garde au Togo. Coordonnées, appel direct, SMS, WhatsApp et Google Maps.',
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MobilePage() {
  // Les pharmacies sont baked-in dans le HTML au moment du SSR (build pour
  // la production). Aucun fetch client → excellent pour le SEO.
  const pharmacies = SCRAPED_PHARMACIES.map((p) => ({
    ...p,
    scrapedAt: new Date().toISOString(),
  }));

  return (
    <>
      {/* Données structurées : ItemList des 212 pharmacies (carrousel Google) */}
      <JsonLd id="ld-pharmacy-list" data={pharmacyListJsonLd(pharmacies)} />
      <JsonLd
        id="ld-breadcrumb-mobile"
        data={breadcrumbJsonLd([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Pharmacies de garde', url: canonicalUrl('/mobile') },
        ])}
      />

      <MobilePharmaciesExplorer initialPharmacies={pharmacies} />
    </>
  );
}
