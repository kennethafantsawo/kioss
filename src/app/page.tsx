/**
 * @page Home
 * @description Page principale - Liste des pharmacies de garde au Togo
 */

'use client';

import { usePharmacies } from '@/hooks/use-pharmacies';
import { PharmacyHeader } from '@/components/pharmacy/pharmacy-header';
import { PharmacyList } from '@/components/pharmacy/pharmacy-list';
import { PharmacyFooter } from '@/components/pharmacy/pharmacy-footer';
import { EmptyState } from '@/components/pharmacy/empty-state';

export default function Home() {
  const {
    filteredPharmacies,
    isLoading,
    isRefreshing,
    error,
    lastUpdate,
    searchQuery,
    setSearchQuery,
    refresh,
    clearCache,
    pharmacies,
  } = usePharmacies();

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <PharmacyHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        onClearCache={clearCache}
        totalPharmacies={pharmacies.length}
        filteredCount={filteredPharmacies.length}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Indicateur de dernière mise à jour */}
        {!isLoading && lastUpdate && !error && (
          <div className="mb-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>Dernière mise à jour</span>
            <span className="font-medium text-gray-500">
              {new Date(lastUpdate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {/* Indicateur de rafraîchissement */}
        {isRefreshing && (
          <div className="mb-4 flex items-center justify-center gap-2 text-xs text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Mise à jour en cours...</span>
          </div>
        )}

        {/* Contenu principal */}
        {isLoading ? (
          <EmptyState type="loading" />
        ) : error ? (
          <EmptyState type="error" message={error} />
        ) : filteredPharmacies.length === 0 && hasSearch ? (
          <EmptyState
            type="no-results"
            message={`Aucune pharmacie ne correspond à « ${searchQuery } »`}
          />
        ) : filteredPharmacies.length === 0 ? (
          <EmptyState
            type="no-results"
            message="Aucune pharmacie de garde trouvée pour le moment."
          />
        ) : (
          <PharmacyList pharmacies={filteredPharmacies} />
        )}
      </main>

      <PharmacyFooter />
    </div>
  );
}
