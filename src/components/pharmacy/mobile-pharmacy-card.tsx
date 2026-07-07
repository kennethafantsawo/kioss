/**
 * @component MobilePharmacyCard
 * @description Carte pharmacie interactive pour la version mobile.
 *
 * Numéro cliquable : au clic, ouvre une feuille d'action (bottom sheet)
 * proposant Appeler / SMS / WhatsApp.
 *
 * Bouton carte (Google Maps) séparé.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  MessageCircle,
  MapPin,
  Clock,
  ChevronDown,
  X,
} from 'lucide-react';
import type { Pharmacy } from '@/hooks/use-pharmacies';
import {
  toTelHref,
  toSmsHref,
  toWhatsAppHref,
  toGoogleMapsHref,
  toDisplay,
  toInternational,
} from '@/lib/format-phone';

interface MobilePharmacyCardProps {
  pharmacy: Pharmacy;
}

export function MobilePharmacyCard({ pharmacy }: MobilePharmacyCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activePhone, setActivePhone] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Fermer la feuille si clic en dehors
  useEffect(() => {
    if (!sheetOpen) return;
    function handleClick(e: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setSheetOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setSheetOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [sheetOpen]);

  const openPhoneSheet = (phone: string) => {
    setActivePhone(phone);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setTimeout(() => setActivePhone(null), 200);
  };

  return (
    <>
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
          <button
            type="button"
            onClick={() => openPhoneSheet(pharmacy.phones[0])}
            className="text-xs text-gray-600 mt-1.5 flex items-start gap-1.5 text-left w-full hover:text-emerald-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
            <span className="flex-1">{pharmacy.address}</span>
          </button>
        </div>

        {/* Corps : numéro cliquable + bouton carte */}
        <div className="p-4 space-y-3">
          {/* Numéros de téléphone cliquables */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {pharmacy.phones.length > 1 ? 'Numéros (cliquez pour appeler)' : 'Numéro (cliquez pour appeler)'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {pharmacy.phones.map((phone, idx) => (
                <button
                  key={`${phone}-${idx}`}
                  type="button"
                  onClick={() => openPhoneSheet(phone)}
                  className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-95 px-3 py-1.5 rounded-lg border border-emerald-200 transition-all"
                  aria-label={`Choisir l'action pour ${toInternational(phone)}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  {toDisplay(phone)}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Bouton localisation Google Maps */}
          <a
            href={toGoogleMapsHref(pharmacy.name, pharmacy.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 active:scale-[0.98] transition-all shadow-sm"
            aria-label={`Voir la localisation de ${pharmacy.name} sur Google Maps`}
          >
            <MapPin className="w-4 h-4" />
            Voir sur la carte
          </a>

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

      {/* Bottom sheet : choix d'action pour le numéro sélectionné */}
      {activePhone && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-200 ${
            sheetOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Choisir une action pour ce numéro"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSheet}
          />

          {/* Feuille */}
          <div
            ref={sheetRef}
            className={`relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl transition-transform duration-200 ${
              sheetOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {/* Poignée de tirage */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* En-tête */}
            <div className="px-5 pb-3 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Contacter via
                </p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {toDisplay(activePhone)}
                </p>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="p-3 space-y-2 pb-6">
              {/* Appeler */}
              <a
                href={toTelHref(activePhone)}
                onClick={closeSheet}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-sm">Appeler</div>
                  <div className="text-xs text-emerald-100 font-normal">
                    {toInternational(activePhone)}
                  </div>
                </div>
              </a>

              {/* SMS */}
              <a
                href={toSmsHref(activePhone)}
                onClick={closeSheet}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-sm">Envoyer un SMS</div>
                  <div className="text-xs text-blue-100 font-normal">
                    Ouvre l'app Messages
                  </div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={toWhatsAppHref(activePhone)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeSheet}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-sm">WhatsApp</div>
                  <div className="text-xs text-green-100 font-normal">
                    Ouvre une conversation
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
