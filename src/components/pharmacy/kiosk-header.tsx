/**
 * @component KioskHeader
 * @description En-tête kiosk fixe : branding, horloge, compteur, semaine active.
 * Mode lecture seule — sauf le bouton reload (marqué data-kiosk-allow) qui
 * passe à travers le verrouillage KioskLockdown.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, ShieldCheck, Clock, RefreshCw, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCurrentGuardWeek, type GuardWeek } from '@/lib/guard-week';

interface KioskHeaderProps {
  totalPharmacies: number;
  lastUpdate: string | null;
  /** Déclenche un refresh forcé des pharmacies */
  onReload?: () => void | Promise<void>;
  /** Indique qu'un refresh est en cours (affiche un spinner) */
  isRefreshing?: boolean;
}

export function KioskHeader({
  totalPharmacies,
  lastUpdate,
  onReload,
  isRefreshing = false,
}: KioskHeaderProps) {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [guardWeek, setGuardWeek] = useState<GuardWeek | null>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDate(
        now.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
      setGuardWeek(getCurrentGuardWeek(now));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Formater l'heure avec le séparateur clignotant
  const [hours, minutes, seconds] = time.split(':');

  const handleReload = useCallback(async () => {
    if (spinning || isRefreshing) return;
    setSpinning(true);
    try {
      await onReload?.();
    } finally {
      // Animation minimum 600ms pour feedback visuel
      setTimeout(() => setSpinning(false), 600);
    }
  }, [onReload, spinning, isRefreshing]);

  const isRotating = spinning || isRefreshing;

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shrink-0">
      {/* Motif décoratif de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-4 sm:py-5">
        {/* Ligne 1 : Logo + titre à gauche, horloge à droite */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo et titre (avec bouton reload transparent devant) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg shadow-emerald-900/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {/* Bouton reload transparent — passe à travers KioskLockdown via data-kiosk-allow */}
                {onReload && (
                  <button
                    type="button"
                    onClick={handleReload}
                    data-kiosk-allow="true"
                    aria-label="Recharger les pharmacies"
                    title="Recharger les pharmacies"
                    disabled={isRotating}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-transparent hover:bg-white/15 active:bg-white/25 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:outline-none"
                    style={{ cursor: isRotating ? 'wait' : 'pointer' }}
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 text-white ${isRotating ? 'animate-spin' : ''}`}
                      strokeWidth={2.5}
                    />
                  </button>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
                  Pharmacies de Garde
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-100 text-sm mt-0.5">
                <MapPin className="w-4 h-4" />
                <span>Disponibles au Togo, 24h/24</span>
              </div>
            </div>
          </div>

          {/* Horloge temps réel */}
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-0.5 font-mono text-3xl sm:text-4xl font-bold tracking-tight tabular-nums">
              <span>{hours}</span>
              <span className="kiosk-clock-separator">:</span>
              <span>{minutes}</span>
              <span className="kiosk-clock-separator">:</span>
              <span className="text-2xl sm:text-3xl text-emerald-200">{seconds}</span>
            </div>
            <p className="text-emerald-100 text-xs sm:text-sm capitalize mt-0.5">
              {date}
            </p>
          </div>
        </div>

        {/* Ligne 2 : Stats + semaine active */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/15">
          <Badge
            variant="secondary"
            className="bg-white/15 text-white border-0 text-sm px-3 py-1.5 font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            {totalPharmacies} pharmacies de garde
          </Badge>

          {/* Semaine active de garde */}
          {guardWeek && (
            <Badge
              variant="secondary"
              className="bg-amber-400/20 text-amber-50 border border-amber-200/30 text-sm px-3 py-1.5 font-semibold"
              title={`Semaine du ${guardWeek.rangeLabel}`}
            >
              <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
              {guardWeek.fullLabel}
              <span className="ml-1.5 font-normal text-amber-100/80 text-xs hidden sm:inline">
                · {guardWeek.rangeLabel}
              </span>
            </Badge>
          )}

          {lastUpdate && (
            <div className="flex items-center gap-1.5 text-emerald-200 text-xs sm:text-sm ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Mise à jour :{' '}
                {new Date(lastUpdate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
