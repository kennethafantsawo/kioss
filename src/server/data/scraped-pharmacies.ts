/**
 * @module scraped-pharmacies
 * @description Données officielles du tour de garde des pharmacies du Togo.
 *
 * Source : Ministère de la Santé du Togo - Direction de la Pharmacie, du Médicament
 *         et des Laboratoires
 * Période : 06 juillet 2026 au 04 janvier 2027 (second semestre)
 *
 * Fichier source parsé : TDG Des Pharmacies Du 06 Juillet 2026 Au 04 Janvier 2027.xlsx
 * Script de parsing : scripts/parse_pharmacies_excel.py
 *
 * 212 pharmacies uniques extraites, chacune avec sa semaine de garde précise.
 *
 * Pour rafraîchir ces données avec un nouveau fichier Excel officiel :
 *   1. Placer le .xlsx dans /home/z/my-project/upload/
 *   2. Modifier INPUT_FILE dans scripts/parse_pharmacies_excel.py
 *   3. Lancer : python3 scripts/parse_pharmacies_excel.py
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
  /** Date de début de la semaine de garde (format DD/MM/YYYY) */
  gardeWeekStart?: string;
  /** Date de fin de la semaine de garde (format DD/MM/YYYY) */
  gardeWeekEnd?: string;
}

/** Date d'import (figée) */
const SCRAPED_AT = new Date();

/** Pharmacies parsées depuis le fichier Excel officiel */
export const SCRAPED_PHARMACIES: Pharmacy[] = (scrapedData as ScrapedPharmacy[]).map((p) => ({
  id: p.id,
  name: p.name,
  address: p.address,
  phones: p.phones,
  url: p.url,
  scrapedAt: SCRAPED_AT,
  gardeWeekStart: p.gardeWeekStart,
  gardeWeekEnd: p.gardeWeekEnd,
}));
