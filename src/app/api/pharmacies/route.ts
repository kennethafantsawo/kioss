/**
 * @route GET /api/pharmacies
 * @description API de récupération des pharmacies de garde au Togo
 * Supporte le paramètre `refresh=true` pour forcer le re-scraping
 */

import { NextResponse } from 'next/server';
import { getPharmacyController, ensureSchedulerStarted } from '@/server/container';

export async function GET(request: Request) {
  // Démarrer le scheduler au premier appel (singleton)
  ensureSchedulerStarted();

  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    const controller = getPharmacyController();
    const result = await controller.getPharmacies(forceRefresh);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Erreur lors du scraping',
          pharmacies: [],
          totalFound: 0,
          scrapedAt: result.scrapedAt,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      pharmacies: result.pharmacies,
      totalFound: result.totalFound,
      scrapedAt: result.scrapedAt,
      fromCache: !forceRefresh,
    });
  } catch (error) {
    console.error('[API /pharmacies] Erreur interne:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur interne du serveur',
        pharmacies: [],
        totalFound: 0,
        scrapedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
