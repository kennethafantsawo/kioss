/**
 * @module SchedulerService
 * @description Planificateur de scraping automatique
 * Scraping automatique tous les lundis à 18h00 et 19h50 (Atlantic/Reykjavik)
 * Principe SRP : gère uniquement la planification des tâches
 */

import type { IScraperService, ICacheService, SyncResult } from '../interfaces';
import { createLogger } from '../utils/logger';

/** Fuseau horaire du Togo */
const TIMEZONE = 'Atlantic/Reykjavik';

/** Horaires de scraping : lundi 18h00 et lundi 19h50 */
const SCHEDULED_SLOTS: Array<{ day: number; hour: number; minute: number; label: string }> = [
  { day: 1, hour: 18, minute: 0, label: 'Lundi 18h00' },
  { day: 1, hour: 19, minute: 50, label: 'Lundi 19h50' },
];

export class SchedulerService {
  private scraperService: IScraperService;
  private cacheService: ICacheService<SyncResult>;
  private logger = createLogger('SchedulerService');
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastRunTimestamps: Map<string, number> = new Map();

  constructor(
    scraperService: IScraperService,
    cacheService: ICacheService<SyncResult>
  ) {
    this.scraperService = scraperService;
    this.cacheService = cacheService;
  }

  /**
   * Démarre le planificateur (vérifie chaque minute)
   */
  start(): void {
    if (this.intervalId) {
      this.logger.warn('Le planificateur est déjà en cours d\'exécution');
      return;
    }

    this.logger.info('Démarrage du planificateur', {
      timezone: TIMEZONE,
      slots: SCHEDULED_SLOTS.map((s) => s.label),
    });

    // Vérification immédiate au démarrage
    this.checkAndRun();

    // Vérification toutes les 60 secondes
    this.intervalId = setInterval(() => {
      this.checkAndRun();
    }, 60_000);
  }

  /**
   * Arrête le planificateur
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.logger.info('Planificateur arrêté');
    }
  }

  /**
   * Vérifie si on est dans un créneau de scraping et exécute si nécessaire
   */
  private checkAndRun(): void {
    const now = this.getNowInTogo();

    const day = now.getDay(); // 0=Dimanche, 1=Lundi...
    const hour = now.getHours();
    const minute = now.getMinutes();

    for (const slot of SCHEDULED_SLOTS) {
      if (day === slot.day && hour === slot.hour && minute === slot.minute) {
        const key = `${slot.label}-${now.toISOString().slice(0, 10)}`;

        // Éviter de lancer deux fois dans la même minute
        const lastRun = this.lastRunTimestamps.get(key) || 0;
        if (Date.now() - lastRun < 55_000) {
          return;
        }

        this.lastRunTimestamps.set(key, Date.now());
        this.executeScraping(slot.label);
      }
    }
  }

  /**
   * Exécute le scraping et met à jour le cache
   */
  private async executeScraping(label: string): Promise<void> {
    this.logger.info(`Exécution du scraping planifié (${label})...`);

    try {
      const result = await this.scraperService.scrape();

      if (result.success && result.pharmacies.length > 0) {
        // Mettre en cache avec TTL long (jusqu'au prochain créneau)
        const cacheTtl = 7 * 24 * 60 * 60 * 1000; // 7 jours
        this.cacheService.set(result, cacheTtl);

        this.logger.info(`Scraping planifié réussi (${label})`, {
          totalFound: result.totalFound,
          durationMs: result.durationMs,
        });
      } else {
        this.logger.error(`Scraping planifié échoué (${label})`, {
          error: result.error,
        });
      }
    } catch (error) {
      this.logger.error(`Erreur lors du scraping planifié (${label})`, {
        error: error instanceof Error ? error.message : 'Inconnu',
      });
    }
  }

  /**
   * Retourne la date/heure actuelle dans le fuseau du Togo
   */
  private getNowInTogo(): Date {
    const now = new Date();
    // Formater dans le fuseau horaire et re-parsé pour avoir le bon objet Date
    const tzString = now.toLocaleString('en-US', { timeZone: TIMEZONE });
    return new Date(tzString);
  }
}
