/**
 * @module structured-data
 * @description Génération des données structurées JSON-LD (schema.org)
 *
 * Ces données permettent à Google d'afficher des "rich snippets" :
 *   - Carrousel de pharmacies
 *   - Cartes de contact cliquables
 *   - Horaires d'ouverture
 *   - Boutons d'appel direct
 *
 * Référence : https://schema.org/MedicalOrganization
 */

import type { Pharmacy } from '@/hooks/use-pharmacies';
import { SITE_URL, SITE_NAME } from './seo-config';
import { toInternational } from './format-phone';

/**
 * Schema.org : organisation médicale (pharmacie).
 * https://schema.org/Pharmacy
 */
export function pharmacyJsonLd(pharmacy: Pharmacy) {
  const primaryPhone = pharmacy.phones[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    '@id': `${SITE_URL}/pharmacie/${pharmacy.id}`,
    name: pharmacy.name,
    description: `Pharmacie de garde au Togo - ${pharmacy.name}. Disponible pour urgences et médicaments. Coordonnées : ${pharmacy.address}.`,
    url: `${SITE_URL}/pharmacie/${pharmacy.id}`,
    telephone: primaryPhone ? toInternational(primaryPhone) : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: pharmacy.address,
      addressLocality: 'Lomé',
      addressCountry: 'TG',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Togo',
    },
    medicalSpecialty: 'Pharmacy',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    isAccessibleForFree: true,
    publicAccess: true,
  };
}

/**
 * Schema.org : ItemList de toutes les pharmacies (pour carrousel Google).
 */
export function pharmacyListJsonLd(pharmacies: Pharmacy[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pharmacies de garde au Togo',
    description: `Liste complète des ${pharmacies.length} pharmacies de garde au Togo.`,
    numberOfItems: pharmacies.length,
    itemListElement: pharmacies.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: pharmacyJsonLd(p),
    })),
  };
}

/**
 * Schema.org : WebSite (pour la recherche site-links Google).
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Annuaire des pharmacies de garde au Togo',
    inLanguage: 'fr-TG',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Schema.org : BreadcrumbList (fil d'ariane pour Google).
 */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Schema.org : FAQPage (questions fréquentes sur les pharmacies de garde).
 */
export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Qu\'est-ce qu\'une pharmacie de garde au Togo ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Une pharmacie de garde est une pharmacie ouverte en dehors des heures normales d\'ouverture, y compris la nuit, les week-ends et les jours fériés, pour assurer l\'accès aux médicaments en cas d\'urgence. Au Togo, les pharmacies de garde sont répertoriées par quartier et par ville.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment trouver une pharmacie de garde à Lomé ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Consultez notre annuaire en ligne qui liste les 212 pharmacies de garde au Togo. Vous pouvez rechercher par nom, adresse ou numéro de téléphone, puis appeler directement ou envoyer un message WhatsApp depuis votre mobile.',
        },
      },
      {
        '@type': 'Question',
        name: 'Les pharmacies de garde au Togo sont-elles ouvertes 24h/24 ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, les pharmacies de garde assurent une permanence 24h/24 et 7j/7, y compris les week-ends et jours fériés. Les numéros de téléphone fournis permettent de les contacter à tout moment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Puis-je commander des médicaments par WhatsApp ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, notre site permet d\'ouvrir directement une conversation WhatsApp avec la pharmacie de votre choix. Cliquez sur le numéro de téléphone de la pharmacie puis sélectionnez WhatsApp.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment appeler une pharmacie de garde depuis l\'étranger ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pour appeler une pharmacie de garde au Togo depuis l\'étranger, composez le +228 suivi du numéro à 8 chiffres (par exemple +228 22 26 21 22). L\'indicatif international du Togo est +228.',
        },
      },
    ],
  };
}

/**
 * Schema.org : Organization (pour la boîte de connaissances Google).
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512x512.png`,
    description: 'Annuaire des pharmacies de garde au Togo, accessible 24h/24.',
    areaServed: {
      '@type': 'Country',
      name: 'Togo',
    },
    sameAs: [],
  };
}
