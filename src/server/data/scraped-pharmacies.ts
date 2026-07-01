/**
 * @module scraped-pharmacies
 * @description Données réelles scrapées depuis annuairestogo.com.
 *
 * Source : https://www.annuairestogo.com/liste-pharmacie-de-garde
 * Scraping effectué via scripts/scrape_pharmacies.py (qui utilise z-ai page_reader
 * pour contourner la protection DDoS de LWS).
 *
 * 48 pharmacies extraites le 2026-07-01.
 *
 * Pour rafraîchir ces données :
 *   python3 scripts/scrape_pharmacies.py
 */

import type { Pharmacy } from '../interfaces';

// Import du JSON généré par le script Python
import scrapedData from './scraped-pharmacies.json';

interface ScrapedPharmacy {
  id: string;
  name: string;
  address: string;
  phones: string[];
  url: string;
}

/** Date de scraping (figée à l'import) */
const SCRAPED_AT = new Date();

/** Pharmacies scrapées, formatées avec la date d'import */
export const SCRAPED_PHARMACIES: Pharmacy[] = (scrapedData as ScrapedPharmacy[]).map((p) => ({
  id: p.id,
  name: p.name,
  address: p.address,
  phones: p.phones,
  url: p.url,
  scrapedAt: SCRAPED_AT,
}));
