/**
 * @module Container
 * @description Conteneur d'injection de dépendances
 * Principe DIP : centralise la création et le câblage des dépendances
 * Pattern Singleton pour les services
 */

import { ScraperService } from './services/scraper.service';
import { CacheService } from './services/cache.service';
import { PharmacyController } from './controllers/pharmacy.controller';
import type { IPharmacyController, IScraperService, ICacheService, SyncResult } from './interfaces';

// --- Instances singleton des services ---
let scraperServiceInstance: IScraperService | null = null;
let cacheServiceInstance: ICacheService<SyncResult> | null = null;
let pharmacyControllerInstance: IPharmacyController | null = null;

/**
 * Récupère ou crée l'instance du ScraperService
 */
export function getScraperService(): IScraperService {
  if (!scraperServiceInstance) {
    scraperServiceInstance = new ScraperService();
  }
  return scraperServiceInstance;
}

/**
 * Récupère ou crée l'instance du CacheService
 */
export function getCacheService(): ICacheService<SyncResult> {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService<SyncResult>();
  }
  return cacheServiceInstance;
}

/**
 * Récupère ou crée l'instance du PharmacyController
 * Injection des dépendances via le constructeur
 */
export function getPharmacyController(): IPharmacyController {
  if (!pharmacyControllerInstance) {
    pharmacyControllerInstance = new PharmacyController(
      getScraperService(),
      getCacheService()
    );
  }
  return pharmacyControllerInstance;
}
