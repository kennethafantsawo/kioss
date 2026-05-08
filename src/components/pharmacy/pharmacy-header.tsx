/**
 * @component PharmacyHeader
 * @description En-tête de l'application avec logo, titre et recherche
 */

'use client';

import {
  Search,
  RefreshCw,
  MapPin,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PharmacyHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
  onClearCache: () => Promise<void>;
  totalPharmacies: number;
  filteredCount: number;
}

export function PharmacyHeader({
  searchQuery,
  onSearchChange,
  isRefreshing,
  onRefresh,
  onClearCache,
  totalPharmacies,
  filteredCount,
}: PharmacyHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
      {/* Motif décoratif de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Logo et titre */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-sm">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              Pharmacies de Garde
            </h1>
            <div className="flex items-center gap-1.5 text-emerald-100 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>Disponibles au Togo, 24h/24</span>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-300" />
          <Input
            type="text"
            placeholder="Rechercher par nom, adresse ou téléphone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-5 sm:py-6 h-auto bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-emerald-200/70 rounded-xl text-sm sm:text-base focus:bg-white/15 focus:border-white/40 transition-all"
          />
        </div>

        {/* Actions et stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge
            variant="secondary"
            className="bg-white/15 text-white border-0 text-xs sm:text-sm px-3 py-1"
          >
            {filteredCount === totalPharmacies
              ? `${totalPharmacies} pharmacies`
              : `${filteredCount} sur ${totalPharmacies}`}
          </Badge>

          <div className="flex gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCache}
              className="text-white/80 hover:text-white hover:bg-white/10 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Vider cache</span>
            </Button>
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Rafraîchir
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
