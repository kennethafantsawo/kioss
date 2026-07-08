/**
 * @component MobilePharmaciesExplorer
 * @description Version CLIENT de la liste mobile interactive (recherche + filtre par semaine).
 *
 * Reçoit les pharmacies initiales en props (depuis le server component /mobile).
 * Évite un round-trip API au premier rendu → meilleures perfs + moins de
 * latence sur mobile.
 *
 * Filtres disponibles :
 *   - Par semaine de garde (sélecteur de chips en haut, défaut = semaine en cours)
 *   - Par recherche texte (nom, adresse, téléphone)
 */

'use client';

import { useMemo, useState } from 'react';
import type { Pharmacy } from '@/hooks/use-pharmacies';
import { MobilePharmacyCard } from '@/components/pharmacy/mobile-pharmacy-card';
import { MobileSearchBar } from '@/components/pharmacy/mobile-search-bar';
import { WeekSelector } from '@/components/pharmacy/week-selector';
import { EmptyState } from '@/components/pharmacy/empty-state';
import { RefreshCw, ShieldCheck, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCurrentGuardWeek } from '@/lib/guard-week';
import {
  getPharmaciesByWeek,
  getCurrentWeekKey,
  ALL_WEEKS_KEY,
  isCurrentWeek,
} from '@/lib/guard-weeks';
import Link from 'next/link';

interface MobilePharmaciesExplorerProps {
  initialPharmacies: Pharmacy[];
}

export function MobilePharmaciesExplorer({
  initialPharmacies,
}: MobilePharmaciesExplorerProps) {
  const [pharmacies] = useState<Pharmacy[]>(initialPharmacies);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculer la liste des semaines une seule fois
  const weeks = useMemo(() => getPharmaciesByWeek(pharmacies), [pharmacies]);

  // Semaine sélectionnée : défaut = semaine en cours (ou prochaine)
  const [selectedWeekKey, setSelectedWeekKey] = useState<string>(() => {
    const currentKey = getCurrentWeekKey(weeks);
    return currentKey || ALL_WEEKS_KEY;
  });

  // 1) Filtre par semaine
  const pharmaciesForWeek = useMemo(() => {
    if (selectedWeekKey === ALL_WEEKS_KEY) return pharmacies;
    return pharmacies.filter((p) => {
      const key = `${p.gardeWeekStart} -> ${p.gardeWeekEnd}`;
      return key === selectedWeekKey;
    });
  }, [pharmacies, selectedWeekKey]);

  // 2) Filtre par recherche (nom, adresse, téléphone)
  const filteredPharmacies = useMemo(() => {
    if (!searchQuery.trim()) return pharmaciesForWeek;

    const query = searchQuery.toLowerCase().trim();
    const normalizedQuery = query.replace(/\s+/g, '');

    return pharmaciesForWeek.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const addressMatch = p.address.toLowerCase().includes(query);
      const phoneMatch = p.phones.some((phone) => {
        const phoneWithSpaces = phone.toLowerCase().includes(query);
        const phoneNoSpaces = phone.replace(/\s+/g, '').includes(normalizedQuery);
        return phoneWithSpaces || phoneNoSpaces;
      });
      return nameMatch || addressMatch || phoneMatch;
    });
  }, [pharmaciesForWeek, searchQuery]);

  const guardWeek = useMemo(() => getCurrentGuardWeek(), []);

  // Trouver le libellé de la semaine sélectionnée
  const selectedWeekInfo = useMemo(() => {
    if (selectedWeekKey === ALL_WEEKS_KEY) return null;
    return weeks.find((w) => w.key === selectedWeekKey) || null;
  }, [weeks, selectedWeekKey]);

  const isShowingCurrentWeek = useMemo(() => {
    if (!selectedWeekInfo) return false;
    return isCurrentWeek(selectedWeekInfo);
  }, [selectedWeekInfo]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/pharmacies?refresh=true', { method: 'GET' });
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header compact mobile */}
      <header className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shrink-0">
        <div className="px-4 py-4">
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
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all disabled:opacity-50"
              aria-label="Recharger les pharmacies"
            >
              <RefreshCw
                className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className="bg-white/15 text-white border-0 text-xs px-2.5 py-1 font-semibold">
              <ShieldCheck className="w-3 h-3 mr-1" />
              {filteredPharmacies.length} pharmacie{filteredPharmacies.length > 1 ? 's' : ''}
              {selectedWeekKey !== ALL_WEEKS_KEY && (
                <span className="ml-1 opacity-80">/ {pharmacies.length}</span>
              )}
            </Badge>
            {isShowingCurrentWeek && (
              <Badge className="bg-emerald-400/30 text-white border border-emerald-200/40 text-xs px-2.5 py-1 font-semibold animate-pulse">
                Semaine en cours
              </Badge>
            )}
            <Badge className="bg-amber-400/20 text-amber-50 border border-amber-200/30 text-xs px-2.5 py-1 font-semibold">
              {guardWeek.fullLabel}
            </Badge>
          </div>
        </div>
      </header>

      {/* Sélecteur de semaine de garde */}
      <WeekSelector
        weeks={weeks}
        selectedKey={selectedWeekKey}
        onSelect={setSelectedWeekKey}
      />

      {/* Barre de recherche sticky */}
      <MobileSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        totalResults={filteredPharmacies.length}
        totalAll={pharmaciesForWeek.length}
      />

      {/* Bandeau d'info sur la semaine sélectionnée */}
      {selectedWeekInfo && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-xs text-emerald-800 flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          <span>
            Semaine du <strong>{selectedWeekInfo.fullLabel}</strong> —{' '}
            {filteredPharmacies.length} pharmacie{filteredPharmacies.length > 1 ? 's' : ''} de garde
            {searchQuery.trim() && ` (filtrée par "${searchQuery}")`}
          </span>
        </div>
      )}
      {selectedWeekKey === ALL_WEEKS_KEY && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-xs text-amber-800 flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" />
          <span>
            Affichage de toutes les pharmacies du semestre ({filteredPharmacies.length} / {pharmacies.length})
          </span>
        </div>
      )}

      {/* Liste des pharmacies */}
      <main className="flex-1 px-4 py-4">
        {filteredPharmacies.length === 0 ? (
          <EmptyState
            type="no-results"
            message={
              searchQuery.trim()
                ? `Aucune pharmacie ne correspond à "${searchQuery}"`
                : 'Aucune pharmacie de garde trouvée pour cette semaine.'
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

        {/* Section SEO : contenu textuel enrichi (keyword-rich) — caché visuellement mais indexable */}
        <section className="mt-8 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm text-sm text-gray-700 leading-relaxed">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Pharmacies de garde au Togo
          </h2>
          <p className="mb-2">
            Notre annuaire répertorie les <strong>{pharmacies.length} pharmacies de garde</strong>{' '}
            du Togo pour le second semestre 2026-2027 (6 juillet 2026 au 4 janvier 2027),
            telles que définies par le Ministère de la Santé du Togo. Chaque pharmacie
            assure une permanence <strong>24h/24 et 7j/7</strong> durant sa semaine de garde.
          </p>
          <p className="mb-2">
            Pour chaque pharmacie, vous disposez des coordonnées complètes :
            nom, adresse précise, numéros de téléphone au format international
            (+228), et un bouton d&apos;appel direct ou WhatsApp. Vous pouvez
            également localiser la pharmacie sur Google Maps d&apos;un seul
            clic.
          </p>
          <p className="mb-3">
            Sélectionnez votre semaine de garde ci-dessus pour voir uniquement
            les pharmacies actives cette semaine, ou choisissez &quot;Toutes&quot;
            pour parcourir l&apos;intégralité du semestre.
          </p>
          <p className="text-xs text-gray-500">
            En cas d&apos;urgence vitale, appelez le{' '}
            <strong className="text-gray-700">112</strong> (numéro
            d&apos;urgence gratuit).
          </p>
        </section>

        {/* Liens internes (SEO + UX) */}
        <nav className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-sm">
          <h2 className="text-base font-bold text-gray-900 mb-2">Liens utiles</h2>
          <ul className="space-y-1.5">
            <li>
              <Link
                href="/"
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold"
              >
                → Mode affichage kiosk (télévision)
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacie/sante"
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold"
              >
                → Pharmacie SANTE (page détaillée)
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacie/akofa"
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold"
              >
                → Pharmacie AKOFA (page détaillée)
              </Link>
            </li>
          </ul>
        </nav>
      </main>

      <footer className="px-4 py-4 text-center text-[10px] text-gray-400 border-t border-gray-100 bg-white">
        <p>Pharmacies de Garde au Togo · Données officielles Ministère de la Santé</p>
        <p className="mt-0.5">
          En cas d&apos;urgence vitale, appelez le{' '}
          <span className="font-semibold text-gray-600">112</span>
        </p>
      </footer>
    </div>
  );
}
