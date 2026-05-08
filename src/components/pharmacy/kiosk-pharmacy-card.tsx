/**
 * @component KioskPharmacyCard
 * @description Carte pharmacie en mode kiosk (lecture seule)
 * Pas de clic, pas de liens — affichage pur
 */

'use client';

import { MapPin, Phone, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Pharmacy } from '@/hooks/use-pharmacies';

interface KioskPharmacyCardProps {
  pharmacy: Pharmacy;
}

export function KioskPharmacyCard({ pharmacy }: KioskPharmacyCardProps) {
  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow-md border border-gray-100">
      {/* Barre colorée en haut */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

      <div className="p-5 pt-6">
        {/* Nom + badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {pharmacy.name}
          </h3>
          <Badge
            variant="outline"
            className="shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-50 border-emerald-200 px-2.5 py-0.5"
          >
            <Clock className="w-3 h-3 mr-1" />
            Garde
          </Badge>
        </div>

        {/* Adresse */}
        <div className="flex items-start gap-2.5 mb-4">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-base text-gray-600 leading-relaxed">
            {pharmacy.address}
          </p>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-100 my-3" />

        {/* Téléphones (affichage seul) */}
        {pharmacy.phones.length > 0 ? (
          <div className="space-y-2">
            {pharmacy.phones.map((phone, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50/60"
              >
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-base font-semibold text-gray-800 tracking-wide">
                  (+228) {phone}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic px-1">
            Aucun numéro de téléphone disponible
          </p>
        )}
      </div>
    </div>
  );
}
