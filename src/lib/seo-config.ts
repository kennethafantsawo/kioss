/**
 * @module seo-config
 * @description Configuration SEO centralisée du site.
 *
 * Tous les éléments SEO (titres, descriptions, URLs canoniques, mots-clés)
 * sont gérés ici pour garantir la cohérence sur toutes les pages.
 *
 * Site : Pharmacies de Garde au Togo
 * Domaine cible : (à configurer via NEXT_PUBLIC_SITE_URL)
 * Audience : Togo (fr-TG), langue française
 */

/** URL de base du site (pour canonical, sitemap, Open Graph) */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://pharmaguard-lome.vercel.app';

/** Nom commercial du site */
export const SITE_NAME = 'Pharmacies de Garde au Togo';

/** Description courte (≤160 caractères) */
export const SITE_SHORT_DESCRIPTION =
  'Liste complète et mise à jour des 48 pharmacies de garde au Togo (Lomé et régions). Numéros de téléphone, adresses, appel direct, WhatsApp et itinéraire Google Maps.';

/** Description longue pour le contenu SEO */
export const SITE_LONG_DESCRIPTION =
  "Trouvez rapidement la pharmacie de garde la plus proche de chez vous au Togo. Notre annuaire répertorie l'intégralité des pharmacies de garde du pays avec leurs coordonnées complètes : nom, adresse précise, numéros de téléphone (format international +228), appel direct, SMS, WhatsApp et localisation Google Maps. Service gratuit, accessible 24h/24 et 7j/7, optimisé pour mobile.";

/** Mots-clés SEO principaux */
export const SITE_KEYWORDS = [
  // Génériques
  'pharmacie de garde',
  'pharmacie de garde Togo',
  'pharmacie de garde Lomé',
  'pharmacie garde Togo',
  // Spécifiques
  'pharmacie ouverte Togo',
  'pharmacie nuit Lomé',
  'pharmacie weekend Togo',
  'pharmacie urgences Togo',
  'pharmacie 24h Togo',
  // Action
  'appeler pharmacie Togo',
  'WhatsApp pharmacie Togo',
  'numéro pharmacie garde Lomé',
  // Géographiques
  'pharmacie Lomé',
  'pharmacie Kara Togo',
  'pharmacie Sokodé',
  'pharmacie Kpalimé',
  // Santé
  'urgence médicale Togo',
  'médicaments urgence Togo',
  'santé Togo',
  // Marque
  'PharmasTogo',
  'annuaire pharmacie Togo',
];

/** Auteur / éditeur */
export const SITE_AUTHOR = 'Pharmacies de Garde Togo';

/** Locales (Togo = fr-TG) */
export const SITE_LOCALE = 'fr_TG';
export const SITE_LANGUAGE = 'fr';

/** Couleur de thème (mobile browser chrome) */
export const THEME_COLOR = '#047857';

/** Twitter handle (si disponible) */
export const TWITTER_HANDLE = '@pharmacies_togo';

/**
 * Génère les métadonnées Open Graph standardisées.
 */
export function buildOpenGraph({
  title,
  description,
  url,
  type = 'website',
  image,
}: {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  image?: string;
}) {
  return {
    title,
    description,
    url,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type,
    images: image
      ? [{ url: image, width: 1200, height: 630, alt: title }]
      : [
          {
            url: `${SITE_URL}/icons/og-image.png`,
            width: 1200,
            height: 630,
            alt: SITE_NAME,
          },
        ],
  };
}

/**
 * Génère les métadonnées Twitter Card standardisées.
 */
export function buildTwitterCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    card: 'summary_large_image' as const,
    site: TWITTER_HANDLE,
    title,
    description,
    images: [image || `${SITE_URL}/icons/og-image.png`],
  };
}

/**
 * Génère l'URL canonique absolue à partir d'un chemin relatif.
 */
export function canonicalUrl(path: string = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
