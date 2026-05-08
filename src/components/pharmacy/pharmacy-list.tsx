/**
 * @component PharmacyList
 * @description Grille responsive des cartes pharmacies
 */

'use client';

import { PharmacyCard } from './pharmacy-card';
import type { Pharmacy } from '@/hooks/use-pharmacies';

interface PharmacyListProps {
  pharmacies: Pharmacy[];
}

export function PharmacyList({ pharmacies }: PharmacyListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {pharmacies.map((pharmacy) => (
        <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
      ))}
    </div>
  );
}
