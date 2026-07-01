/**
 * @component MobilePharmacyCard
 * @description Carte pharmacie interactive pour la version mobile.
 * Boutons d'action : Appel, SMS, WhatsApp, Localisation Google Maps.
 */

'use client';

import { Phone, MessageSquare, MessageCircle, MapPin, Clock } from 'lucide-react';
import type { Pharmacy } from '@/hooks/use-pharmacies';
import {
  toTelHref,
  toSmsHref,
  toWhatsAppHref,
  toGoogleMapsHref,
  toDisplay,
} from '@/lib/format-phone';

interface MobilePharmacyCardProps {
  pharmacy: Pharmacy;
}

export function MobilePharmacyCard({ pharmacy }: MobilePharmacyCardProps) {
  const primaryPhone = pharmacy.phones[0];
  const allPhones = pharmacy.phones;

  return (
    <article
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      data-pharmacy-id={pharmacy.id}
    >
      {/* En-tête : nom + statut */}
      <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-100">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-gray-900 leading-tight flex-1">
            {pharmacy.name}
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Garde
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1.5 flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
          <span>{pharmacy.address}</span>
        </p>
      </div>

      {/* Corps : numéros + actions */}
      <div className="p-4 space-y-3">
        {/* Numéros de téléphone */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {allPhones.length > 1 ? 'Numéros' : 'Numéro'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allPhones.map((phone, idx) => (
              <span
                key={`${phone}-${idx}`}
                className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg"
              >
                {toDisplay(phone)}
              </span>
            ))}
          </div>
        </div>

        {/* Boutons d'action principaux (grille 2x2) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Appel */}
          <a
            href={primaryPhone ? toTelHref(primaryPhone) : '#'}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
            aria-label={`Appeler ${pharmacy.name}`}
          >
            <Phone className="w-4 h-4" />
            Appeler
          </a>

          {/* SMS */}
          <a
            href={primaryPhone ? toSmsHref(primaryPhone) : '#'}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
            aria-label={`Envoyer un SMS à ${pharmacy.name}`}
          >
            <MessageSquare className="w-4 h-4" />
            SMS
          </a>

          {/* WhatsApp */}
          <a
            href={primaryPhone ? toWhatsAppHref(primaryPhone) : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 active:scale-95 transition-all shadow-sm"
            aria-label={`Contacter ${pharmacy.name} sur WhatsApp`}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>

          {/* Localisation Google Maps */}
          <a
            href={toGoogleMapsHref(pharmacy.name, pharmacy.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
            aria-label={`Voir la localisation de ${pharmacy.name} sur Google Maps`}
          >
            <MapPin className="w-4 h-4" />
            Carte
          </a>
        </div>

        {/* Pied : horodatage des données */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1 border-t border-gray-100">
          <Clock className="w-3 h-3" />
          <span>
            Données du{' '}
            {new Date(pharmacy.scrapedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
