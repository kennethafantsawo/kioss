/**
 * @module interfaces
 * @description Définitions des types principaux de l'application
 * Respecte le principe ISP (Interface Segregation Principle)
 */

/** Informations de contact d'une pharmacie */
export interface PharmacyContact {
  phones: string[];
}

/** Données complètes d'une pharmacie */
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phones: string[];
  url?: string;
  scrapedAt: Date;
  /** Semaine de garde - date de début (format DD/MM/YYYY) */
  gardeWeekStart?: string;
  /** Semaine de garde - date de fin (format DD/MM/YYYY) */
  gardeWeekEnd?: string;
}

/** Résultat d'une opération de synchronisation (scraping) */
export interface SyncResult {
  success: boolean;
  pharmacies: Pharmacy[];
  totalFound: number;
  scrapedAt: string;
  error?: string;
  durationMs: number;
}

/** Interface du service de scraping (SRP + DIP) */
export interface IScraperService {
  scrape(): Promise<SyncResult>;
}

/** Interface du service de cache (SRP) */
export interface ICacheService<T> {
  get(): T | null;
  set(data: T, ttlMs?: number): void;
  clear(): boolean;
  getStats(): CacheStats;
}

/** Statistiques du cache */
export interface CacheStats {
  hasData: boolean;
  cachedAt: string | null;
  size: number;
}

/** Interface du contrôleur pharmacie (SRP) */
export interface IPharmacyController {
  getPharmacies(forceRefresh?: boolean): Promise<SyncResult>;
  clearCache(): { success: boolean; message: string };
}
