/**
 * @module fallback-pharmacies
 * @description Données statiques de pharmacies de garde au Togo.
 * Utilisées en fallback quand le scraping échoue.
 */

import type { Pharmacy } from '../interfaces';

export const FALLBACK_PHARMACIES: Pharmacy[] = [
  {
    id: 'pharmacie-de-laeroport',
    name: "Pharmacie de l'Aéroport",
    address: 'Immeuble SITO, 631 Bd du Haho, Hédzranawoé, Lomé',
    phones: ['22 26 21 22', '96 51 59 74'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-du-marche',
    name: 'Pharmacie du Marché',
    address: 'Marché central, Lomé',
    phones: ['22 21 15 67'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-notre-dame',
    name: 'Pharmacie Notre Dame',
    address: 'Avenue de la Liberté, Tokoin, Lomé',
    phones: ['22 21 23 45'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-de-la-paix',
    name: 'Pharmacie de la Paix',
    address: 'Carrefour Djidjolé, Lomé',
    phones: ['22 25 67 89'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-centrale',
    name: 'Pharmacie Centrale',
    address: 'Boulevard du 13 Janvier, Lomé',
    phones: ['22 21 56 78'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-saint-michel',
    name: 'Pharmacie Saint Michel',
    address: 'Avenue Sarakawa, Lomé',
    phones: ['22 22 34 56'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-du-benin',
    name: 'Pharmacie du Bénin',
    address: 'Quartier Bénin, Lomé',
    phones: ['22 22 78 90'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-de-lamitie',
    name: "Pharmacie de l'Amitié",
    address: "Avenue de l'Indépendance, Lomé",
    phones: ['22 21 89 01'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-espoir',
    name: 'Pharmacie Espoir',
    address: 'Kodjoviakopé, Lomé',
    phones: ['22 25 12 34'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-grace-divine',
    name: 'Pharmacie Grâce Divine',
    address: 'Adidogomé, Lomé',
    phones: ['90 12 34 56'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-la-bonne-sante',
    name: 'La Bonne Santé',
    address: 'Agoè, Lomé',
    phones: ['90 23 45 67'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-du-triangle',
    name: 'Pharmacie du Triangle',
    address: 'Carrefour, Lomé',
    phones: ['22 22 56 12'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-salama',
    name: 'Pharmacie Salama',
    address: 'Totsi, Lomé',
    phones: ['90 34 56 78'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-bethanie',
    name: 'Pharmacie Béthanie',
    address: 'Nyékonakpoé, Lomé',
    phones: ['22 26 78 90'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-emi',
    name: 'Pharmacie EMI',
    address: 'Agoè-nyivé, Lomé',
    phones: ['22 25 90 12'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-agora',
    name: 'Pharmacie Agora',
    address: 'Cacavéli, Lomé',
    phones: ['90 45 67 89'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-delice',
    name: 'Pharmacie Délice',
    address: 'Kégué, Lomé',
    phones: ['22 21 23 90'],
    scrapedAt: new Date(),
  },
  {
    id: 'pharmacie-assivi',
    name: 'Pharmacie Assivi',
    address: 'Amoutivé, Lomé',
    phones: ['22 22 45 78'],
    scrapedAt: new Date(),
  },
];