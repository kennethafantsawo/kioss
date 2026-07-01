/**
 * @page /mobile
 * @description Version mobile interactive de l'application.
 *
 * Contrairement à la page kiosk `/` (qui bloque toute interaction), cette page
 * est conçue pour smartphones et tablettes : recherche, appel, SMS, WhatsApp,
 * ouverture de la localisation Google Maps.
 *
 * Détection automatique :
 *   - Si un visiteur mobile accède à `/`, le middleware le redirige ici.
 *   - Sur desktop, on garde la page kiosk `/` par défaut.
 */

'use client';

import { useMemo, useState } from 'react';
import { usePharmacies } from '@/hooks/use-pharmacies';
import { MobilePharmacyCard } from '@/components/pharmacy/mobile-pharmacy-card';
import { MobileSearchBar } from '@/components/pharmacy/mobile-search-bar';
import { EmptyState } from '@/components/pharmacy/empty-state';
import { ShieldCheck, RefreshCw, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCurrentGuardWeek } from '@/lib/guard-week';

export default function MobilePage() {
  const {
    pharmacies,
    isLoading,
    isRefreshing,
    error,
    lastUpdate,
    refresh,
  } = usePharmacies();

  const [searchQuery, setSearchQuery] = useState('');

  // Filtrage par recherche (nom, adresse, téléphone)
  const filteredPharmacies = useMemo(() => {
    if (!searchQuery.trim()) return pharmacies;

    const query = searchQuery.toLowerCase().trim();
    // Normaliser aussi les espaces des numéros pour matching robuste
    const normalizedQuery = query.replace(/\s+/g, '');

    return pharmacies.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const addressMatch = p.address.toLowerCase().includes(query);
      const phoneMatch = p.phones.some((phone) => {
        const phoneWithSpaces = phone.toLowerCase().includes(query);
        const phoneNoSpaces = phone.replace(/\s+/g, '').includes(normalizedQuery);
        return phoneWithSpaces || phoneNoSpaces;
      });
      return nameMatch || addressMatch || phoneMatch;
    });
  }, [pharmacies, searchQuery]);

  const guardWeek = useMemo(() => getCurrentGuardWeek(), []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header compact mobile */}
      <header className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shrink-0">
        <div className="px-4 py-4">
          {/* Titre + bouton reload */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight leading-none">
                Pharmacies de Garde
              </h1>
              <p className="text-emerald-100 text-xs mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Togo · 24h/24
              </p>
            </div>
            <button
              type="button"
              onClick={() => refresh()}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all disabled:opacity-50"
              aria-label="Recharger les pharmacies"
            >
              <RefreshCw
                className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Stats + semaine active */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className="bg-white/15 text-white border-0 text-xs px-2.5 py-1 font-semibold">
              <ShieldCheck className="w-3 h-3 mr-1" />
              {pharmacies.length} pharmacies
            </Badge>
            <Badge className="bg-amber-400/20 text-amber-50 border border-amber-200/30 text-xs px-2.5 py-1 font-semibold">
              {guardWeek.fullLabel}
            </Badge>
            {lastUpdate && (
              <span className="text-emerald-100 text-[10px] ml-auto">
                MAJ :{' '}
                {new Date(lastUpdate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Barre de recherche sticky */}
      <MobileSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        totalResults={filteredPharmacies.length}
        totalAll={pharmacies.length}
      />

      {/* Liste des pharmacies */}
      <main className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
            </div>
            <p className="text-sm text-gray-500">Chargement des pharmacies…</p>
          </div>
        ) : error ? (
          <EmptyState type="error" message={error} />
        ) : filteredPharmacies.length === 0 ? (
          <EmptyState
            type="no-results"
            message={
              searchQuery.trim()
                ? `Aucune pharmacie ne correspond à "${searchQuery}"`
                : 'Aucune pharmacie de garde trouvée pour le moment.'
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredPharmacies.map((pharmacy) => (
              <MobilePharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
              />
            ))}
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="px-4 py-4 text-center text-[10px] text-gray-400 border-t border-gray-100 bg-white">
        <p>
          Pharmacies de Garde au Togo · Données indicatives
        </p>
        <p className="mt-0.5">
          En cas d&apos;urgence vitale, appelez le <span className="font-semibold text-gray-600">112</span>
        </p>
      </footer>
    </div>
  );
}
