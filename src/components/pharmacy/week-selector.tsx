/**
 * @component WeekSelector
 * @description Sélecteur de semaine de garde sous forme de chips horizontaux.
 *
 * Affiche toutes les semaines du semestre, avec :
 *   - Une chip "Toutes" pour voir les 212 pharmacies
 *   - Une chip par semaine, libellée "06/07 → 13/07" + compteur
 *   - Badges "En cours" / "À venir" / "Passée"
 *   - Chip active mise en évidence
 *
 * Scroll horizontal sur mobile pour permettre beaucoup de semaines.
 */

'use client';

import { Check, Clock, Calendar } from 'lucide-react';
import type { GuardWeekGroup } from '@/lib/guard-weeks';
import {
  isCurrentWeek,
  isUpcomingWeek,
  isPastWeek,
  ALL_WEEKS_KEY,
} from '@/lib/guard-weeks';

interface WeekSelectorProps {
  weeks: GuardWeekGroup[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function WeekSelector({
  weeks,
  selectedKey,
  onSelect,
}: WeekSelectorProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 pt-3 pb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        <Calendar className="w-3.5 h-3.5" />
        Semaine de garde
      </div>
      <div
        className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Chip "Toutes" */}
        <button
          type="button"
          onClick={() => onSelect(ALL_WEEKS_KEY)}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedKey === ALL_WEEKS_KEY
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Toutes
          <span
            className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedKey === ALL_WEEKS_KEY
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {weeks.reduce((sum, w) => sum + w.pharmacyCount, 0)}
          </span>
        </button>

        {/* Chips par semaine */}
        {weeks.map((week) => {
          const isSelected = selectedKey === week.key;
          const current = isCurrentWeek(week);
          const upcoming = isUpcomingWeek(week);
          const past = isPastWeek(week);

          let badgeText: string | null = null;
          let badgeClass = '';
          if (current) {
            badgeText = 'En cours';
            badgeClass = 'bg-emerald-100 text-emerald-700';
          } else if (upcoming) {
            badgeText = 'À venir';
            badgeClass = 'bg-amber-100 text-amber-700';
          } else if (past) {
            badgeText = 'Passée';
            badgeClass = 'bg-gray-100 text-gray-500';
          }

          return (
            <button
              key={week.key}
              type="button"
              onClick={() => onSelect(week.key)}
              className={`shrink-0 inline-flex flex-col items-start px-3.5 py-2 rounded-xl text-xs font-semibold transition-all min-w-[110px] ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md'
                  : current
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : past
                      ? 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                      : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="font-mono">{week.shortLabel}</span>
                {isSelected && <Check className="w-3 h-3 ml-auto" />}
              </div>
              <div className="flex items-center gap-1.5 w-full mt-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : badgeClass
                  }`}
                >
                  {badgeText || `${week.pharmacyCount} pharmacies`}
                </span>
                {!badgeText && (
                  <span
                    className={`text-[10px] ${
                      isSelected ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {week.pharmacyCount} pharmacies
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
