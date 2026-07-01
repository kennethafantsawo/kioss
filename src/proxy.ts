/**
 * @module proxy
 * @description Détection automatique du device et redirection.
 *
 * Next.js 16 : le fichier `middleware.ts` est déprécié au profit de `proxy.ts`.
 * La fonction exportée doit s'appeler `proxy` (au lieu de `middleware`).
 *
 * - Mobile (iPhone, Android, etc.) accédant à `/` → redirigé vers `/mobile`
 * - Desktop accédant à `/` → garde la page kiosk (lecture seule, défilement auto)
 * - `/mobile` reste accessible depuis n'importe quel device (si l'utilisateur
 *   veut forcer la version interactive)
 *
 * On sniff le User-Agent côté serveur. C'est une heuristique simple mais
 * largement suffisante pour ce cas d'usage (redirection, pas du styling).
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Regex pour détecter les mobiles (extrait du détecteur de Express) */
const MOBILE_UA_PATTERN =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // On n'agit que sur la racine `/` (page kiosk par défaut)
  if (pathname !== '/') {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';

  // Si c'est un mobile, rediriger vers /mobile
  if (MOBILE_UA_PATTERN.test(userAgent)) {
    const url = request.nextUrl.clone();
    url.pathname = '/mobile';
    return NextResponse.redirect(url, 302);
  }

  // Desktop : continuer vers la page kiosk
  return NextResponse.next();
}

export const config = {
  // Matcher : on ne traite que la racine pour la détection mobile
  matcher: ['/'],
};
