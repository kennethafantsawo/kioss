/**
 * @module usePharmacies
 * @description Hook personnalisé pour la gestion des données pharmacies
 * Gère le fetch, le cache, le rafraîchissement et la recherche
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phones: string[];
  url?: string;
  scrapedAt: string;
}

interface PharmaciesResponse {
  success: boolean;
  pharmacies: Pharmacy[];
  totalFound: number;
  scrapedAt: string;
  fromCache?: boolean;
  error?: string;
}

interface UsePharmaciesReturn {
  pharmacies: Pharmacy[];
  filteredPharmacies: Pharmacy[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdate: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refresh: () => Promise<void>;
  clearCache: () => Promise<void>;
}

export function usePharmacies(): UsePharmaciesReturn {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPharmacies = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const url = forceRefresh
        ? '/api/pharmacies?refresh=true'
        : '/api/pharmacies';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const data: PharmaciesResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement des données');
      }

      setPharmacies(data.pharmacies);
      setLastUpdate(data.scrapedAt);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  // Recherche filtrée
  const filteredPharmacies = useMemo(() => {
    if (!searchQuery.trim()) return pharmacies;

    const query = searchQuery.toLowerCase().trim();
    return pharmacies.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.phones.some((phone) => phone.includes(query))
    );
  }, [pharmacies, searchQuery]);

  // Rafraîchir manuellement
  const refresh = useCallback(async () => {
    await fetchPharmacies(true);
  }, [fetchPharmacies]);

  // Vider le cache
  const clearCache = useCallback(async () => {
    try {
      await fetch('/api/pharmacies/clear-cache', { method: 'POST' });
      await fetchPharmacies(true);
    } catch {
      setError('Erreur lors du vidage du cache');
    }
  }, [fetchPharmacies]);

  return {
    pharmacies,
    filteredPharmacies,
    isLoading,
    isRefreshing,
    error,
    lastUpdate,
    searchQuery,
    setSearchQuery,
    refresh,
    clearCache,
  };
}
