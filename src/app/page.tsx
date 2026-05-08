/**
 * @page Home - MODE KIOSK
 * @description Affichage kiosk vertical : curseur masqué, pas d'interaction,
 * défilement automatique infini de la liste des pharmacies.
 */

'use client';

import { usePharmacies } from '@/hooks/use-pharmacies';
import { KioskHeader } from '@/components/pharmacy/kiosk-header';
import { KioskScrollList } from '@/components/pharmacy/kiosk-scroll-list';
import { KioskFooter } from '@/components/pharmacy/kiosk-footer';
import { EmptyState } from '@/components/pharmacy/empty-state';

export default function Home() {
  const {
    pharmacies,
    isLoading,
    error,
    lastUpdate,
  } = usePharmacies();

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header fixe */}
      <KioskHeader
        totalPharmacies={pharmacies.length}
        lastUpdate={lastUpdate}
      />

      {/* Zone de défilement automatique infini */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState type="loading" />
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState type="error" message={error} />
        </div>
      ) : pharmacies.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            type="no-results"
            message="Aucune pharmacie de garde trouvée pour le moment."
          />
        </div>
      ) : (
        <KioskScrollList pharmacies={pharmacies} />
      )}

      {/* Footer fixe */}
      <KioskFooter />
    </div>
  );
}
