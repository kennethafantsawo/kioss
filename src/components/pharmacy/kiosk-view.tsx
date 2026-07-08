/**
 * @component KioskView
 * @description Vue kiosk interactive (client-side) : défilement automatique
 * infini des pharmacies de la semaine en cours, horloge, bouton reload.
 *
 * Le mode kiosk affiche uniquement les pharmacies de garde pour la semaine
 * en cours (53 pharmacies max) pour éviter un défilement interminable de 212
 * pharmacies. Toutes les pharmacies restent dans le HTML SSR (section sr-only
 * dans /) pour le SEO.
 */

'use client';

import { useMemo } from 'react';
import { usePharmacies } from '@/hooks/use-pharmacies';
import { KioskHeader } from '@/components/pharmacy/kiosk-header';
import { KioskScrollList } from '@/components/pharmacy/kiosk-scroll-list';
import { KioskFooter } from '@/components/pharmacy/kiosk-footer';
import { EmptyState } from '@/components/pharmacy/empty-state';
import { KioskLockdown } from '@/components/pharmacy/kiosk-lockdown';
import type { Pharmacy } from '@/hooks/use-pharmacies';
import {
  getPharmaciesByWeek,
  getCurrentWeekKey,
} from '@/lib/guard-weeks';

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

  // Pharmacies disponibles (fetch API ou fallback SSR)
  const allPharmacies = pharmacies.length > 0 ? pharmacies : initialPharmacies;

  // Garder uniquement la semaine en cours pour le kiosk
  const displayedPharmacies = useMemo(() => {
    const weeks = getPharmaciesByWeek(allPharmacies);
    const currentWeekKey = getCurrentWeekKey(weeks);
    if (!currentWeekKey) return allPharmacies;

    return allPharmacies.filter((p) => {
      const key = `${p.gardeWeekStart} -> ${p.gardeWeekEnd}`;
      return key === currentWeekKey;
    });
  }, [allPharmacies]);

  // Semaine en cours libellé
  const currentWeekLabel = useMemo(() => {
    const weeks = getPharmaciesByWeek(allPharmacies);
    const currentKey = getCurrentWeekKey(weeks);
    if (!currentKey) return null;
    const week = weeks.find((w) => w.key === currentKey);
    return week?.fullLabel || null;
  }, [allPharmacies]);

  return (
    <>
      <KioskLockdown />
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <KioskHeader
          totalPharmacies={displayedPharmacies.length}
          lastUpdate={lastUpdate}
          onReload={refresh}
          isRefreshing={isRefreshing}
          currentWeekLabel={currentWeekLabel}
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
              message="Aucune pharmacie de garde trouvée pour la semaine en cours."
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
