/**
 * @module ScraperService
 * @description Service de données pharmacies de garde au Togo.
 * Source principale : données officielles du Ministère de la Santé du Togo (212 pharmacies).
 * Fallback : données statiques de secours si le scraping est vide.
 * Principe SRP : unique responsabilité = fournir les données pharmacies
 * Principe DIP : dépend de l'interface IScraperService
 */

import type { Pharmacy, SyncResult, IScraperService } from '../interfaces';
import { SCRAPED_PHARMACIES } from '../data/scraped-pharmacies';
import { FALLBACK_PHARMACIES } from '../data/fallback-pharmacies';
import { createLogger } from '../utils/logger';

export class ScraperService implements IScraperService {
  private logger = createLogger('ScraperService');

  /**
   * Retourne les données des pharmacies
   */
  async scrape(): Promise<SyncResult> {
    const startTime = Date.now();
    this.logger.info('Chargement des pharmacies de garde');

    try {
      // Source principale : pharmacies scrapées depuis annuairestogo.com
      // Fallback : pharmacies statiques si scraping vide
      const source =
        SCRAPED_PHARMACIES.length > 0
          ? SCRAPED_PHARMACIES
          : FALLBACK_PHARMACIES;

      this.logger.info('Source de données sélectionnée', {
        source: SCRAPED_PHARMACIES.length > 0 ? 'scraped' : 'fallback',
        count: source.length,
      });

      const pharmacies: Pharmacy[] = source.map((p) => ({
        ...p,
        scrapedAt: new Date(),
      }));

      const durationMs = Date.now() - startTime;

      const result: SyncResult = {
        success: true,
        pharmacies,
        totalFound: pharmacies.length,
        scrapedAt: new Date().toISOString(),
        durationMs,
      };

      this.logger.info('Données chargées avec succès', {
        totalFound: pharmacies.length,
        durationMs,
      });

      return result;
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

      this.logger.error('Erreur lors du chargement', {
        error: errorMessage,
        durationMs,
      });

      return {
        success: false,
        pharmacies: [],
        totalFound: 0,
        scrapedAt: new Date().toISOString(),
        error: errorMessage,
        durationMs,
      };
    }
  }
}