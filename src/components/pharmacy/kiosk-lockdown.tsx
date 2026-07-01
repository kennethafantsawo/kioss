/**
 * @component KioskLockdown
 * @description BOUCLIER KIOSK TOTAL.
 * Un overlay invisible couvre 100% de l'écran (z-index: 9999999).
 * AUCUNE interaction possible : ni souris, ni tactile, ni clavier, ni fingerprint.
 * Zéro action. L'écran est en lecture seule absolue.
 */

'use client';

import { useEffect } from 'react';

/** Tous les événements à tuer */
const KILL_EVENTS = [
  // Souris
  'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout',
  'mouseenter', 'mouseleave', 'click', 'dblclick', 'contextmenu',
  'wheel', 'auxclick',
  // Drag & Drop
  'dragstart', 'drag', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop',
  // Pointer
  'pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout',
  'pointerenter', 'pointerleave', 'pointercancel', 'gotpointercapture', 'lostpointercapture',
  // Tactile
  'touchstart', 'touchmove', 'touchend', 'touchcancel',
  // Clavier
  'keydown', 'keyup', 'keypress',
  // Geste / zoom
  'gesturestart', 'gesturechange', 'gestureend',
  // Sélection / copie
  'selectstart', 'selectionchange', 'copy', 'cut', 'paste',
  // Focus / input
  'focusin', 'focusout', 'beforeinput', 'input', 'change', 'submit', 'reset',
  // Scroll
  'scroll', 'wheel',
] as const;

function kill(e: Event): boolean {
  // Exception : les éléments marqués data-kiosk-allow="true" (et leurs descendants)
  // sont autorisés à interagir. Indispensable pour le bouton reload du header.
  const target = e.target as Element | null;
  if (target && typeof target.closest === 'function' && target.closest('[data-kiosk-allow="true"]')) {
    return true; // ne pas bloquer
  }

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
}

export function KioskLockdown() {
  useEffect(() => {
    const cleanup: Array<() => void> = [];

    // Tuer tous les événements sur document (capture phase = le plus tôt possible)
    for (const evt of KILL_EVENTS) {
      document.addEventListener(evt, kill, { capture: true, passive: false });
      cleanup.push(() => document.removeEventListener(evt, kill, { capture: true }));
    }

    // Tuer aussi sur window pour les événements qui ne propagent pas au document
    for (const evt of ['contextmenu', 'dragover', 'drop', 'resize'] as const) {
      window.addEventListener(evt, kill, { capture: true, passive: false });
      cleanup.push(() => window.removeEventListener(evt, kill, { capture: true }));
    }

    // Bloquer le scroll du document
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    // Désactiver WebAuthn / biométrique
    if (typeof PublicKeyCredential !== 'undefined') {
      try {
        const orig = PublicKeyCredential.prototype.constructor;
        Object.defineProperty(window, 'PublicKeyCredential', {
          value: class extends orig {
            static async create() {
              throw new DOMException('Kiosk', 'NotAllowedError');
            }
            static async get() {
              throw new DOMException('Kiosk', 'NotAllowedError');
            }
          },
          writable: false,
          configurable: false,
        });
      } catch { /* ignore */ }
    }

    // Anti-fingerprinting navigator
    try { Object.defineProperty(navigator, 'webdriver', { get: () => false }); } catch { /* ignore */ }

    return () => {
      cleanup.forEach(fn => fn());
      document.documentElement.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  // Overlay invisible qui couvre 100% de l'écran - style inline = priorité maximale
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999999,
        backgroundColor: 'transparent',
        cursor: 'none',
        pointerEvents: 'auto',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        msContentZooming: 'none',
        overscrollBehavior: 'none',
        touchEvents: 'none',
      }}
    />
  );
}