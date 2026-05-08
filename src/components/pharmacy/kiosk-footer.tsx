/**
 * @component KioskFooter
 * @description Bande inférieure kiosk fixe avec infos pharmacie de l'aéroport
 */

'use client';

import { Phone, MapPin, Clock } from 'lucide-react';

export function KioskFooter() {
  return (
    <footer className="shrink-0 border-t border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700">
          <span className="font-bold text-emerald-700 text-sm sm:text-base">
            Pharmacie de l&apos;Aéroport
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>Immeuble SITO, 631 Bd du Haho, Hédzranawoé, Lomé</span>
          </span>
          <span className="text-gray-300 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-700">(+228) 22 26 21 22</span>
          </span>
          <span className="text-gray-300 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-700">96 51 59 74</span>
          </span>
          <span className="text-gray-300 hidden lg:inline">|</span>
          <span className="hidden lg:flex items-center gap-1 text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>Lun-Ven 07h-20h / Sam 07h-13h</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
