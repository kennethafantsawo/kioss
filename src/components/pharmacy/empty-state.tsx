/**
 * @component EmptyState
 * @description Composant affiché quand aucune pharmacie n'est trouvée
 */

'use client';

import { SearchX, AlertTriangle, WifiOff } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-results' | 'error' | 'loading';
  message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  if (type === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chargement des pharmacies...
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Nous récupérons les pharmacies de garde en temps réel depuis le Togo.
        </p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
          {message || 'Impossible de charger les pharmacies. Veuillez réessayer.'}
        </p>
        <WifiOff className="w-5 h-5 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
        <SearchX className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Aucun résultat
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        {message || 'Aucune pharmacie ne correspond à votre recherche.'}
      </p>
    </div>
  );
}
