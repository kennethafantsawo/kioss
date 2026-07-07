/**
 * @component MobileSearchBar
 * @description Barre de recherche sticky pour la page mobile.
 * Filtre les pharmacies par nom, adresse ou numéro de téléphone.
 */

'use client';

import { Search, X } from 'lucide-react';

interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalResults: number;
  totalAll: number;
}

export function MobileSearchBar({
  value,
  onChange,
  totalResults,
  totalAll,
}: MobileSearchBarProps) {
  const hasQuery = value.trim().length > 0;

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3">
        <div className="relative">
          {/* Icône recherche */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

          {/* Champ de saisie */}
          <input
            type="text"
            inputMode="search"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Rechercher par nom, quartier ou numéro…"
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-gray-100 text-sm text-gray-900 placeholder-gray-400 border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
            aria-label="Rechercher une pharmacie"
          />

          {/* Bouton effacer */}
          {hasQuery && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stats résultats */}
        {hasQuery && (
          <p className="text-xs text-gray-500 mt-2 px-1">
            {totalResults === 0
              ? 'Aucune pharmacie trouvée'
              : `${totalResults} pharmacie${totalResults > 1 ? 's' : ''} sur ${totalAll}`}
          </p>
        )}
      </div>
    </div>
  );
}
