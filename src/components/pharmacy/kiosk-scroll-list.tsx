/**
 * @component KioskScrollList
 * @description Défilement automatique infini des pharmacies en mode kiosk
 * Duplique la liste pour créer une boucle invisible
 */

'use client';

import { useMemo, useRef } from 'react';
import { KioskPharmacyCard } from './kiosk-pharmacy-card';
import { EmptyState } from './empty-state';
import type { Pharmacy } from '@/hooks/use-pharmacies';

interface KioskScrollListProps {
  pharmacies: Pharmacy[];
}

/** Vitesse de défilement : ~80px par seconde */
const SCROLL_SPEED_PX_PER_SEC = 80;
const MIN_DURATION_SEC = 60;

export function KioskScrollList({ pharmacies }: KioskScrollListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculer la durée de l'animation avec useMemo (pas de setState dans un effect)
  const scrollDuration = useMemo(() => {
    const estimateCardHeight = 220;
    const gap = 24;
    const totalHeight = pharmacies.length * (estimateCardHeight + gap);
    const duration = Math.max(totalHeight / SCROLL_SPEED_PX_PER_SEC, MIN_DURATION_SEC);
    return Math.round(duration);
  }, [pharmacies.length]);

  if (pharmacies.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState type="loading" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="kiosk-scroll-container flex-1"
    >
      <div
        className="kiosk-scroll-track"
        style={
          {
            '--scroll-duration': `${scrollDuration}s`,
          } as React.CSSProperties
        }
      >
        {/* 2 copies pour la boucle (translate -50%) */}
        <div className="grid grid-cols-3 gap-4 px-4 sm:px-6 lg:px-8 pb-6">
          {[...pharmacies, ...pharmacies].map((pharmacy, index) => (
            <KioskPharmacyCard
              key={`${pharmacy.id}-${index}`}
              pharmacy={pharmacy}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
