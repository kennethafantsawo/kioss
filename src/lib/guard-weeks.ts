/**
 * @module guard-weeks
 * @description Utilitaire pour grouper les pharmacies par semaine de garde.
 *
 * Le fichier Excel officiel du Ministère de la Santé du Togo définit des
 * semaines de garde successives (du lundi au lundi suivant). Chaque pharmacie
 * est assignée à une semaine précise.
 *
 * Fonctions principales :
 *   - parseWeekDate : convertit "06/07/2026" en objet Date
 *   - getWeekKey : génère une clé unique "06/07 -> 13/07" pour une pharmacie
 *   - getPharmaciesByWeek : groupe les pharmacies par semaine
 *   - getCurrentWeekKey : trouve la semaine contenant aujourd'hui (ou la prochaine)
 */

import type { Pharmacy } from '@/hooks/use-pharmacies';

/** Convertit une date au format DD/MM/YYYY en objet Date (minuit local). */
export function parseWeekDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/** Formate une Date en "06/07" (court) ou "06 juil." (français). */
export function formatWeekShort(date: Date, mode: 'numeric' | 'text' = 'numeric'): string {
  if (mode === 'text') {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

/** Interface d'une semaine de garde regroupant plusieurs pharmacies. */
export interface GuardWeekGroup {
  /** Clé unique : "06/07/2026 -> 13/07/2026" */
  key: string;
  /** Date de début */
  start: Date;
  /** Date de fin */
  end: Date;
  /** Libellé court : "06/07 → 13/07" */
  shortLabel: string;
  /** Libellé long : "06 juil. → 13 juil." */
  longLabel: string;
  /** Libellé avec année : "06/07/2026 → 13/07/2026" */
  fullLabel: string;
  /** Nombre de pharmacies cette semaine */
  pharmacyCount: number;
  /** Index de la semaine dans la liste triée (0-based) */
  index: number;
}

/** Trie et groupe les pharmacies par semaine de garde. */
export function getPharmaciesByWeek(
  pharmacies: Pharmacy[]
): GuardWeekGroup[] {
  const groupsMap = new Map<string, GuardWeekGroup & { pharmacies: Pharmacy[] }>();

  for (const pharmacy of pharmacies) {
    const start = parseWeekDate(pharmacy.gardeWeekStart);
    const end = parseWeekDate(pharmacy.gardeWeekEnd);
    if (!start || !end) continue;

    const key = `${pharmacy.gardeWeekStart} -> ${pharmacy.gardeWeekEnd}`;

    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        key,
        start,
        end,
        shortLabel: `${formatWeekShort(start)} → ${formatWeekShort(end)}`,
        longLabel: `${formatWeekShort(start, 'text')} → ${formatWeekShort(end, 'text')}`,
        fullLabel: `${pharmacy.gardeWeekStart} → ${pharmacy.gardeWeekEnd}`,
        pharmacyCount: 0,
        index: 0,
        pharmacies: [],
      });
    }

    const group = groupsMap.get(key)!;
    group.pharmacies.push(pharmacy);
    group.pharmacyCount = group.pharmacies.length;
  }

  // Trier par date de début croissante
  const sortedGroups = Array.from(groupsMap.values()).sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  // Assigner les index
  sortedGroups.forEach((g, idx) => {
    g.index = idx;
  });

  // Retourner sans le tableau pharmacies (allégé)
  return sortedGroups.map(({ pharmacies, ...group }) => group);
}

/**
 * Trouve la semaine active (celle qui contient aujourd'hui).
 * Si aucune ne contient aujourd'hui, retourne la prochaine semaine à venir.
 * Si toutes sont passées, retourne la dernière.
 */
export function getCurrentWeekKey(
  weeks: GuardWeekGroup[],
  now: Date = new Date()
): string | null {
  if (weeks.length === 0) return null;

  // Cherche une semaine qui contient aujourd'hui (start <= now < end)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  for (const week of weeks) {
    // La semaine inclut start, exclut end (end = début de la semaine suivante)
    if (todayStart >= week.start && todayStart < week.end) {
      return week.key;
    }
    // Cas limite : aujourd'hui = end (dernier jour de la semaine)
    if (todayStart.getTime() === week.end.getTime()) {
      // Si c'est le dernier jour, on est encore dans cette semaine
      return week.key;
    }
  }

  // Aucune semaine ne contient aujourd'hui : chercher la prochaine
  const upcoming = weeks.find((w) => w.start > todayStart);
  if (upcoming) return upcoming.key;

  // Toutes les semaines sont passées : retourner la dernière
  return weeks[weeks.length - 1].key;
}

/** Indique si une semaine est celle en cours (aujourd'hui dedans). */
export function isCurrentWeek(
  week: GuardWeekGroup,
  now: Date = new Date()
): boolean {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return (
    (todayStart >= week.start && todayStart < week.end) ||
    todayStart.getTime() === week.end.getTime()
  );
}

/** Indique si une semaine est à venir (début dans le futur). */
export function isUpcomingWeek(
  week: GuardWeekGroup,
  now: Date = new Date()
): boolean {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return week.start > todayStart;
}

/** Indique si une semaine est passée (fin avant aujourd'hui). */
export function isPastWeek(
  week: GuardWeekGroup,
  now: Date = new Date()
): boolean {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return week.end < todayStart;
}

/** Clé spéciale pour "toutes les pharmacies" (toutes semaines confondues). */
export const ALL_WEEKS_KEY = '__all__';
