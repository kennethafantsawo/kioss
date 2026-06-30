/**
 * @component KioskLockdown
 * @description Verrouillage complet de l'écran kiosk.
 * Bloque TOUTES les interactions : souris, tactile, clavier,
 * empreinte digitale, menu contextuel, drag & drop, zoom, copier/coller.
 * Aucune interaction externe n'est possible avec l'écran.
 */

'use client';

import { useEffect } from 'react';

const BLOCKED_MOUSE_EVENTS: (keyof DocumentEventMap)[] = [
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseenter',
  'mouseleave',
  'click',
  'dblclick',
  'contextmenu',
  'wheel',
  'dragstart',
  'drag',
  'dragend',
  'dragover',
  'dragenter',
  'dragleave',
  'drop',
  'pointerdown',
  'pointerup',
  'pointermove',
  'pointerover',
  'pointerout',
  'pointerenter',
  'pointerleave',
  'pointercancel',
  'gotpointercapture',
  'lostpointercapture',
  'mousedown',
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
];

const BLOCKED_KEYBOARD_EVENTS: (keyof DocumentEventMap)[] = [
  'keydown',
  'keyup',
  'keypress',
];

const BLOCKED_WINDOW_EVENTS: (keyof WindowEventMap)[] = [
  'contextmenu',
  'dragover',
  'drop',
];

function preventAll(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
}

function preventKeyboard(e: KeyboardEvent) {
  // Bloquer TOUTES les touches, sans exception
  // Y compris F5 (refresh), F12 (devtools), Ctrl+R, Ctrl+Shift+I, Alt+Tab, etc.
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
}

export function KioskLockdown() {
  useEffect(() => {
    // 1. Bloquer tous les événements souris/tactile/pointeur sur le document
    const mouseCleanup = BLOCKED_MOUSE_EVENTS.map((eventName) => {
      document.addEventListener(eventName, preventAll, {
        capture: true,
        passive: false,
      });
      return () => {
        document.removeEventListener(eventName, preventAll, { capture: true });
      };
    });

    // 2. Bloquer tous les événements clavier
    const keyboardCleanup = BLOCKED_KEYBOARD_EVENTS.map((eventName) => {
      document.addEventListener(eventName, preventKeyboard, {
        capture: true,
        passive: false,
      });
      return () => {
        document.removeEventListener(eventName, preventKeyboard, { capture: true });
      };
    });

    // 3. Bloquer les événements fenêtre
    const windowCleanup = BLOCKED_WINDOW_EVENTS.map((eventName) => {
      window.addEventListener(eventName, preventAll, {
        capture: true,
        passive: false,
      });
      return () => {
        window.removeEventListener(eventName, preventAll, { capture: true });
      };
    });

    // 4. Bloquer la sélection de texte
    document.addEventListener('selectstart', preventAll, { capture: true, passive: false });
    const selectStartCleanup = () => {
      document.removeEventListener('selectstart', preventAll, { capture: true });
    };

    // 5. Bloquer le copier/couper/coller
    document.addEventListener('copy', preventAll, { capture: true, passive: false });
    document.addEventListener('cut', preventAll, { capture: true, passive: false });
    document.addEventListener('paste', preventAll, { capture: true, passive: false });
    const copyCleanup = () => {
      document.removeEventListener('copy', preventAll, { capture: true });
      document.removeEventListener('cut', preventAll, { capture: true });
      document.removeEventListener('paste', preventAll, { capture: true });
    };

    // 6. Bloquer le contrôle biométrique / WebAuthn
    if (typeof PublicKeyCredential !== 'undefined') {
      try {
        // Tente de bloquer les requêtes d'authentification biométrique
        const originalCreate = PublicKeyCredential.prototype.constructor;
        Object.defineProperty(window, 'PublicKeyCredential', {
          value: class extends originalCreate {
            static async create(
              ...args: Parameters<typeof PublicKeyCredential.create>
            ) {
              throw new DOMException(
                'Biométrique désactivée en mode kiosk',
                'NotAllowedError'
              );
            }
            static async get(
              ...args: Parameters<typeof PublicKeyCredential.get>
            ) {
              throw new DOMException(
                'Biométrique désactivée en mode kiosk',
                'NotAllowedError'
              );
            }
          },
          writable: false,
          configurable: false,
        });
      } catch {
        // Silently fail - some browsers don't allow overriding
      }
    }

    // 7. Bloquer la détection d'empreinte digitale via CSS et JS
    // Désactiver les API de navigation qui pourraient être utilisées pour le fingerprinting
    try {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    } catch {
      // ignore
    }

    // 8. Empêcher le zoom par pinch
    document.addEventListener(
      'gesturestart',
      preventAll,
      { capture: true, passive: false }
    );
    document.addEventListener(
      'gesturechange',
      preventAll,
      { capture: true, passive: false }
    );
    document.addEventListener(
      'gestureend',
      preventAll,
      { capture: true, passive: false }
    );
    const gestureCleanup = () => {
      document.removeEventListener('gesturestart', preventAll, { capture: true });
      document.removeEventListener('gesturechange', preventAll, { capture: true });
      document.removeEventListener('gestureend', preventAll, { capture: true });
    };

    return () => {
      mouseCleanup.forEach((fn) => fn());
      keyboardCleanup.forEach((fn) => fn());
      windowCleanup.forEach((fn) => fn());
      selectStartCleanup();
      copyCleanup();
      gestureCleanup();
    };
  }, []);

  // Ce composant ne rend rien visuellement
  return null;
}