/**
 * @component KioskView
 * @description Vue kiosk interactive (client-side) : défilement automatique
 * infini des pharmacies, horloge, bouton reload. Aucune interaction utilisateur
 * sauf le bouton reload.
 */

'use client';

import { usePharmacies } from '@/hooks/use-pharmacies';
import { KioskHeader } from '@/components/pharmacy/kiosk-header';
import { KioskScrollList } from '@/components/pharmacy/kiosk-scroll-list';
import { KioskFooter } from '@/components/pharmacy/kiosk-footer';
import { EmptyState } from '@/components/pharmacy/empty-state';
import { KioskLockdown } from '@/components/pharmacy/kiosk-lockdown';
import type { Pharmacy } from '@/hooks/use-pharmacies';

interface KioskViewProps {
  initialPharmacies: Pharmacy[];
}

export function KioskView({ initialPharmacies }: KioskViewProps) {
  const {
    pharmacies,
    isLoading,
    error,
    lastUpdate,
    isRefreshing,
    refresh,
  } = usePharmacies();

  // Utiliser les pharmacies initiales (SSR) tant que le fetch n'est pas fini
  // pour éviter le flash de chargement.
  const displayedPharmacies = pharmacies.length > 0 ? pharmacies : initialPharmacies;

  return (
    <>
      <KioskLockdown />
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <KioskHeader
          totalPharmacies={displayedPharmacies.length}
          lastUpdate={lastUpdate}
          onReload={refresh}
          isRefreshing={isRefreshing}
        />

        {isLoading && pharmacies.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState type="loading" />
          </div>
        ) : error && pharmacies.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState type="error" message={error} />
          </div>
        ) : displayedPharmacies.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              type="no-results"
              message="Aucune pharmacie de garde trouvée pour le moment."
            />
          </div>
        ) : (
          <KioskScrollList pharmacies={displayedPharmacies} />
        )}

        <KioskFooter />
      </div>
    </>
  );
}
