/**
 * @module guard-week
 * @description Utilitaire de calcul de la semaine de garde active.
 *
 * Au Togo, les pharmacies de garde tournent par semaine (du lundi au dimanche).
 * Le scheduler de l'app rafraîchit les données chaque lundi à 18h00 et 19h50.
 *
 * On expose :
 *   - Le numéro de semaine ISO (1-53)
 *   - Le label "Semaine A" / "Semaine B" (parité du numéro de semaine)
 *   - La plage de dates lundi → dimanche au format court français
 */

export interface GuardWeek {
  /** Numéro de semaine ISO (1-53) */
  isoWeek: number;
  /** "A" pour les semaines impaires, "B" pour les paires */
  label: 'A' | 'B';
  /** Date du lundi de la semaine courante */
  monday: Date;
  /** Date du dimanche de la semaine courante */
  sunday: Date;
  /** Plage préformatée, ex : "lun. 30 juin – dim. 6 juil." */
  rangeLabel: string;
  /** Libellé complet, ex : "Semaine A · n°27" */
  fullLabel: string;
}

/**
 * Calcule le numéro de semaine ISO 8601 d'une date.
 * Semaine 1 = première semaine contenant un jeudi.
 */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/**
 * Retourne le lundi de la semaine de la date donnée (00:00 locale).
 */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay() || 7; // 0 (dimanche) -> 7
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

const DAY_MONTH_FMT = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

/**
 * Calcule toutes les infos de la semaine de garde active.
 */
export function getCurrentGuardWeek(now: Date = new Date()): GuardWeek {
  const isoWeek = getISOWeek(now);
  const monday = getMonday(now);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const label: 'A' | 'B' = isoWeek % 2 === 1 ? 'A' : 'B';

  const mondayStr = DAY_MONTH_FMT.format(monday).replace(/\.$/, '');
  const sundayStr = DAY_MONTH_FMT.format(sunday).replace(/\.$/, '');
  const rangeLabel = `${mondayStr} – ${sundayStr}`;

  const fullLabel = `Semaine ${label} · n°${isoWeek}`;

  return {
    isoWeek,
    label,
    monday,
    sunday,
    rangeLabel,
    fullLabel,
  };
}
