/**
 * @page Home - MODE KIOSK
 * @description Page d&apos;accueil kiosk : défilement automatique infini des
 * pharmacies de garde au Togo.
 *
 * SERVER-SIDE RENDERED pour le SEO (contenu baked-in dans le HTML), avec un
 * client component KioskView pour l&apos;interactivité (horloge, animation,
 * bouton reload).
 *
 * Une section SEO contenant la liste complète des pharmacies est incluse
 * visuellement cachée (sr-only) pour que Google puisse indexer tout le
 * contenu sans être gêné par l&apos;animation kiosk.
 */

import type { Metadata } from 'next';
import { SCRAPED_PHARMACIES } from '@/server/data/scraped-pharmacies';
import { KioskView } from '@/components/pharmacy/kiosk-view';
import { JsonLd } from '@/components/seo/json-ld';
import { pharmacyListJsonLd } from '@/lib/structured-data';
import {
  SITE_NAME,
  SITE_SHORT_DESCRIPTION,
  SITE_KEYWORDS,
  canonicalUrl,
  buildOpenGraph,
  buildTwitterCard,
} from '@/lib/seo-config';
import { toInternational } from '@/lib/format-phone';

export const metadata: Metadata = {
  title: `${SITE_NAME} — 212 pharmacies de garde au Togo (Lomé)`,
  description: SITE_SHORT_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: canonicalUrl('/'),
  },
  openGraph: buildOpenGraph({
    title: `${SITE_NAME} — 212 pharmacies de garde au Togo`,
    description: SITE_SHORT_DESCRIPTION,
    url: canonicalUrl('/'),
  }),
  twitter: buildTwitterCard({
    title: `${SITE_NAME} — 212 pharmacies de garde au Togo`,
    description: SITE_SHORT_DESCRIPTION,
  }),
};

export default function Home() {
  const pharmacies = SCRAPED_PHARMACIES.map((p) => ({
    ...p,
    scrapedAt: new Date().toISOString(),
  }));

  return (
    <>
      {/* Données structurées : ItemList des 212 pharmacies */}
      <JsonLd id="ld-pharmacy-list-home" data={pharmacyListJsonLd(pharmacies)} />

      <KioskView initialPharmacies={pharmacies} />

      {/* Section SEO — visible uniquement pour les crawlers et screen readers.
          Cache visuellement mais reste dans le DOM pour l'indexation. */}
      <section
        aria-hidden="false"
        className="sr-only"
      >
        <h1>Pharmacies de garde au Togo — Liste complète</h1>
        <p>
          Liste complète des {pharmacies.length} pharmacies de garde au Togo,
          principalement situées à Lomé. Chaque pharmacie assure une permanence
          24h/24 et 7j/7 pour les urgences pharmaceutiques.
        </p>
        <ul>
          {pharmacies.map((p) => (
            <li key={p.id}>
              <h2>{p.name}</h2>
              <p>
                Adresse : {p.address}
                <br />
                Téléphone : {p.phones.map(toInternational).join(', ')}
              </p>
              <p>
                {p.name} est une pharmacie de garde située à {p.address}. Vous
                pouvez la contacter au {p.phones.map(toInternational).join(' ou ')}{' '}
                pour vérifier la disponibilité d&apos;un médicament ou pour tout
                besoin pharmaceutique urgent.
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
