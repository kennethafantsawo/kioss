/**
 * @component ServiceWorkerRegistrar
 * @description Enregistre le Service Worker pour la PWA
 */

'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker enregistré:', registration.scope);

            // Vérifier les mises à jour périodiquement
            setInterval(() => {
              registration.update();
            }, 30 * 60 * 1000); // Toutes les 30 minutes
          })
          .catch((error) => {
            console.warn('[PWA] Erreur d\'enregistrement du Service Worker:', error);
          });
      });
    }
  }, []);

  return null;
}
