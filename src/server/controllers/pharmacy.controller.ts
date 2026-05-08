/**
 * @module PharmacyController
 * @description Contrôleur principal de l'API pharmacies
 * Orchestre les services de scraping et de cache
 * Principe SRP : gère uniquement la logique métier de l'API
 * Principe DIP : dépend des abstractions (interfaces)
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

  /**
   * Injection de dépendances via le constructeur (DIP)
   */
  constructor(
    scraperService: IScraperService,
    cacheService: ICacheService<SyncResult>
  ) {
    this.scraperService = scraperService;
    this.cacheService = cacheService;
  }

  /**
   * Récupère la liste des pharmacies
   * Utilise le cache si disponible et valide, sinon scrappe
   */
  async getPharmacies(forceRefresh: boolean = false): Promise<SyncResult> {
    this.logger.info('Récupération des pharmacies', { forceRefresh });

    // Retourner le cache si disponible et pas de rafraîchissement forcé
    if (!forceRefresh) {
      const cached = this.cacheService.get();
      if (cached) {
        this.logger.info('Données servies depuis le cache');
        return cached;
      }
    }

    // Scraper les données fraîches
    this.logger.info('Scraping des données fraîches...');
    const result = await this.scraperService.scrape();

    // Mettre en cache uniquement en cas de succès
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
