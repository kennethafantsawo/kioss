/**
 * @module ScraperService
 * @description Service de scraping des pharmacies de garde au Togo
 * Utilise z-ai-web-dev-sdk (page_reader) pour récupérer le HTML
 * puis cheerio pour parser et extraire les données structurées
 * Principe SRP : unique responsabilité = scraper et parser les données
 * Principe DIP : dépend de l'interface IScraperService
 */

import * as cheerio from 'cheerio';
import ZAI from 'z-ai-web-dev-sdk';
import type { Pharmacy, SyncResult, IScraperService } from '../interfaces';
import { createLogger } from '../utils/logger';

const TARGET_URL = 'https://www.annuairestogo.com/liste-pharmacie-de-garde';

export class ScraperService implements IScraperService {
  private logger = createLogger('ScraperService');
  private zai: ZAI | null = null;

  /**
   * Initialise le SDK z-ai-web-dev-sdk (lazy loading)
   */
  private async getZAI(): Promise<ZAI> {
    if (!this.zai) {
      this.zai = await ZAI.create();
      this.logger.info('SDK z-ai initialisé');
    }
    return this.zai;
  }

  /**
   * Exécute le scraping complet et retourne le résultat structuré
   */
  async scrape(): Promise<SyncResult> {
    const startTime = Date.now();
    this.logger.info('Début du scraping', { url: TARGET_URL });

    try {
      const html = await this.fetchPage(TARGET_URL);
      const pharmacies = this.parsePharmacies(html);
      const durationMs = Date.now() - startTime;

      const result: SyncResult = {
        success: true,
        pharmacies,
        totalFound: pharmacies.length,
        scrapedAt: new Date().toISOString(),
        durationMs,
      };

      this.logger.info('Scraping terminé avec succès', {
        totalFound: pharmacies.length,
        durationMs,
      });

      return result;
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

      this.logger.error('Erreur lors du scraping', {
        error: errorMessage,
        durationMs,
      });

      return {
        success: false,
        pharmacies: [],
        totalFound: 0,
        scrapedAt: new Date().toISOString(),
        error: errorMessage,
        durationMs,
      };
    }
  }

  /**
   * Récupère le HTML de la page cible via z-ai-web-dev-sdk page_reader
   */
  private async fetchPage(url: string): Promise<string> {
    this.logger.info('Récupération de la page via z-ai SDK...', { url });

    const zai = await this.getZAI();
    const result = await zai.functions.invoke('page_reader', { url });

    if (result.code !== 200 || !result.data?.html) {
      throw new Error(
        `Échec de la récupération de la page (code: ${result.code})`
      );
    }

    const html = result.data.html;
    this.logger.info(
      `Page récupérée via z-ai SDK (${(html.length / 1024).toFixed(1)} KB)`
    );
    return html;
  }

  /**
   * Parse le HTML et extrait les données des pharmacies
   */
  private parsePharmacies(html: string): Pharmacy[] {
    this.logger.info('Parsing du HTML...');
    const $ = cheerio.load(html);
    const pharmacies: Pharmacy[] = [];

    // Sélecteur principal : chaque pharmacie est dans une carte dans la grille
    $('.col-lg-4.col-md-12').each((_index, element) => {
      try {
        const pharmacy = this.parsePharmacyCard($, element);
        if (pharmacy) {
          pharmacies.push(pharmacy);
        }
      } catch (error) {
        this.logger.warn("Erreur de parsing d'une carte", {
          error: error instanceof Error ? error.message : 'Inconnu',
        });
      }
    });

    this.logger.info(`${pharmacies.length} pharmacies parsées`);
    return pharmacies;
  }

  /**
   * Parse une carte individuelle de pharmacie
   */
  private parsePharmacyCard(
    $: cheerio.CheerioAPI,
    element: cheerio.AnyNode
  ): Pharmacy | null {
    const card = $(element);

    // Extraire le nom
    const nameElement = card.find('h4.font-weight-bold').first();
    const name = nameElement.text().trim();

    if (!name) return null;

    // Extraire l'adresse
    const addressElement = card.find('p.text-muted').first();
    let address = addressElement.text().trim();

    // Nettoyer l'adresse (retirer les caractères non imprimables)
    address = address
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extraire les numéros de téléphone
    const phones: string[] = [];
    const phoneTexts = card.find('a.text-black');

    phoneTexts.each((_i, phoneEl) => {
      const phoneHtml = $(phoneEl).html() || '';
      // Extraire les numéros entre les balises <b>
      const phoneMatches = phoneHtml.match(/<b>([^<]+)<\/b>/g);

      if (phoneMatches) {
        for (const match of phoneMatches) {
          const cleanPhone = match
            .replace(/<\/?b>/g, '')
            .replace(/[•\s]+/g, ' ')
            .trim();

          if (cleanPhone && /^\d[\d\s]+$/.test(cleanPhone)) {
            phones.push(cleanPhone);
          }
        }
      }
    });

    // Extraire l'URL de la pharmacie
    const linkElement = card.find('a').first();
    const url = linkElement.attr('href') || undefined;

    // Générer un ID slugifié
    const id = this.slugify(name);

    return {
      id,
      name,
      address,
      phones,
      url,
      scrapedAt: new Date(),
    };
  }

  /**
   * Convertit un texte en slug pour l'ID
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // retirer les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
