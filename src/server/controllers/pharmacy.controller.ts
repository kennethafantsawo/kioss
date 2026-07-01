/**
 * @module PharmacyController
 * @description Contrôleur principal de l'API pharmacies
 * Orchestre les services de données et de cache
 */

import type {
  IPharmacyController,
  IScraperService,
  ICacheService,
  SyncResult,
} from '../interfaces';
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
   * Utilise le cache si disponible et valide, sinon charge les données
   */
  async getPharmacies(forceRefresh: boolean = false): Promise<SyncResult> {
    this.logger.info('Récupération des pharmacies', { forceRefresh });

    if (!forceRefresh) {
      const cached = this.cacheService.get();
      if (cached) {
        this.logger.info('Données servies depuis le cache');
        return cached;
      }
    }

    const result = await this.scraperService.scrape();

    if (result.success && result.pharmacies.length > 0) {
      this.cacheService.set(result);
    }

    return result;
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