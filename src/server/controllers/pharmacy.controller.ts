/**
 * @module PharmacyController
 * @description Contrôleur principal de l'API pharmacies
 * Orchestre les services de scraping et de cache
 * Utilise un fallback statique quand le scraping échoue
 */

import type {
  IPharmacyController,
  IScraperService,
  ICacheService,
  SyncResult,
} from '../interfaces';
import { FALLBACK_PHARMACIES } from '../data/fallback-pharmacies';
import { createLogger } from '../utils/logger';

export class PharmacyController implements IPharmacyController {
  private scraperService: IScraperService;
  private cacheService: ICacheService<SyncResult>;
  private logger = createLogger('PharmacyController');

  constructor(
    scraperService: IScraperService,
    cacheService: ICacheService<SyncResult>
  ) {
    this.scraperService = scraperService;
    this.cacheService = cacheService;
  }

  /**
   * Récupère la liste des pharmacies
   * 1. Cache si disponible
   * 2. Sinon scraping
   * 3. Sinon fallback statique
   */
  async getPharmacies(forceRefresh: boolean = false): Promise<SyncResult> {
    this.logger.info('Récupération des pharmacies', { forceRefresh });

    // 1. Retourner le cache si disponible
    if (!forceRefresh) {
      const cached = this.cacheService.get();
      if (cached) {
        this.logger.info('Données servies depuis le cache');
        return cached;
      }
    }

    // 2. Tenter le scraping
    this.logger.info('Tentative de scraping...');
    const result = await this.scraperService.scrape();

    // Si le scraping a réussi, utiliser et cacher les données
    if (result.success && result.pharmacies.length > 0) {
      this.cacheService.set(result);
      return result;
    }

    // 3. Fallback : données statiques
    this.logger.warn('Scraping échoué, utilisation des données de secours', {
      scrapeError: result.error,
    });

    const fallbackResult: SyncResult = {
      success: true,
      pharmacies: FALLBACK_PHARMACIES,
      totalFound: FALLBACK_PHARMACIES.length,
      scrapedAt: new Date().toISOString(),
      durationMs: result.durationMs,
    };

    // Cacher aussi le fallback
    this.cacheService.set(fallbackResult);

    return fallbackResult;
  }

  /**
   * Vide le cache
   */
  clearCache(): { success: boolean; message: string } {
    const stats = this.cacheService.getStats();
    const cleared = this.cacheService.clear();

    const message = stats.hasData
      ? `Cache vidé avec succès (dernière mise à jour : ${stats.cachedAt})`
      : 'Le cache était déjà vide';

    this.logger.info(message);

    return {
      success: cleared,
      message,
    };
  }
}