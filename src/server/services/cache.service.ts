/**
 * @module CacheService
 * @description Service de cache en mémoire avec TTL
 * Principe SRP : gère uniquement le caching des données
 * Principe OCP : générique via TypeScript generics
 */

import type { ICacheService, CacheStats } from '../interfaces';
import { createLogger } from '../utils/logger';

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

export class CacheService<T> implements ICacheService<T> {
  private cache: {
    data: T;
    cachedAt: number;
    ttlMs: number;
  } | null = null;

  private logger = createLogger('CacheService');

  get(): T | null {
    if (!this.cache) {
      this.logger.debug('Cache vide - aucune donnée');
      return null;
    }

    const age = Date.now() - this.cache.cachedAt;
    if (age > this.cache.ttlMs) {
      this.logger.info('Cache expiré', {
        ageMs: age,
        ttlMs: this.cache.ttlMs,
      });
      this.cache = null;
      return null;
    }

    this.logger.debug('Cache hit', {
      ageMs: age,
      remainingMs: this.cache.ttlMs - age,
    });
    return this.cache.data;
  }

  set(data: T, ttlMs: number = DEFAULT_TTL_MS): void {
    this.cache = {
      data,
      cachedAt: Date.now(),
      ttlMs,
    };
    this.logger.info('Données mises en cache', {
      ttlMs,
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    });
  }

  clear(): boolean {
    const hadData = this.cache !== null;
    this.cache = null;

    if (hadData) {
      this.logger.info('Cache vidé avec succès');
    } else {
      this.logger.debug('Cache déjà vide');
    }

    return true;
  }

  getStats(): CacheStats {
    if (!this.cache) {
      return {
        hasData: false,
        cachedAt: null,
        size: 0,
      };
    }

    return {
      hasData: true,
      cachedAt: new Date(this.cache.cachedAt).toISOString(),
      size: JSON.stringify(this.cache.data).length,
    };
  }
}
