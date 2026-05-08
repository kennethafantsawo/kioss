/**
 * @component KioskFooter
 * @description Bande inférieure kiosk fixe (message discret, pas de lien cliquable)
 */

'use client';

import { Heart } from 'lucide-react';

export function KioskFooter() {
  return (
    <footer className="shrink-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-3">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>Données : annuairesTogo.com</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            Fait avec <Heart className="w-3 h-3 text-red-400 fill-red-400" /> pour le Togo
          </span>
          <span className="text-gray-300">|</span>
          <span>Pharmacies de garde 24h/24</span>
        </div>
      </div>
    </footer>
  );
}
