/**
 * @module ScraperService
 * @description Service de données pharmacies de garde au Togo.
 * Utilise les données de secours en mode déployé.
 * Principe SRP : unique responsabilité = fournir les données pharmacies
 * Principe DIP : dépend de l'interface IScraperService
 */

import type { Pharmacy, SyncResult, IScraperService } from '../interfaces';
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
      const pharmacies: Pharmacy[] = FALLBACK_PHARMACIES.map((p) => ({
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