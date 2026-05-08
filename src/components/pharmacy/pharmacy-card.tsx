/**
 * @component PharmacyCard
 * @description Carte individuelle d'une pharmacie avec informations de contact
 */

'use client';

import { MapPin, Phone, ExternalLink, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Pharmacy } from '@/hooks/use-pharmacies';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '');
    window.open(`tel:+228${cleanPhone}`, '_self');
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      {/* Barre colorée en haut */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

      <div className="p-4 sm:p-5 pt-5">
        {/* En-tête : nom + badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            {pharmacy.name}
          </h3>
          <Badge
            variant="outline"
            className="shrink-0 text-[10px] sm:text-xs font-medium text-emerald-700 bg-emerald-50 border-emerald-200"
          >
            <Clock className="w-2.5 h-2.5 mr-0.5" />
            Garde
          </Badge>
        </div>

        {/* Adresse */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            {pharmacy.address}
          </p>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-100 my-3" />

        {/* Téléphones */}
        <div className="space-y-1.5">
          {pharmacy.phones.map((phone, index) => (
            <button
              key={index}
              onClick={() => handleCall(phone)}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors group/phone"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover/phone:text-emerald-700" />
              <span className="text-sm font-medium text-gray-800 group-hover/phone:text-emerald-700">
                (+228) {phone}
              </span>
            </button>
          ))}
        </div>

        {/* Lien vers l'annuaire (si disponible) */}
        {pharmacy.url && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <a
              href={pharmacy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Voir sur annuairesTogo.com
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
