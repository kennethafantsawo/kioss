/**
 * @component PharmacyFooter
 * @description Pied de page de l'application
 */

'use client';

import { Heart, ExternalLink } from 'lucide-react';

export function PharmacyFooter() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
          <p className="flex items-center gap-1">
            Données fournies par{' '}
            <a
              href="https://www.annuairestogo.com/liste-pharmacie-de-garde"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              annuairesTogo.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <p className="flex items-center gap-1">
            Fait avec <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> pour le Togo
          </p>
        </div>
      </div>
    </footer>
  );
}
