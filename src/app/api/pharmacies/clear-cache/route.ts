/**
 * @route POST /api/pharmacies/clear-cache
 * @description Vide le cache des pharmacies pour forcer un re-scraping
 */

import { NextResponse } from 'next/server';
import { getPharmacyController } from '@/server/container';

export async function POST() {
  try {
    const controller = getPharmacyController();
    const result = controller.clearCache();

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /pharmacies/clear-cache] Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors du vidage du cache',
      },
      { status: 500 }
    );
  }
}
