/**
 * @module format-phone
 * @description Utilitaire de formatage des numéros de téléphone togolais.
 *
 * Les numéros dans les données pharmacies sont au format "22 26 21 22" (8 chiffres).
 * Pour les liens profonds (tel:, sms:, wa.me), on a besoin du format international
 * +228XXXXXXXX.
 *
 * Le Togo utilise l'indicatif +228 et tous les numéros font 8 chiffres.
 */

/** Indicatif international du Togo */
export const TOGO_COUNTRY_CODE = '+228';

/**
 * Nettoie un numéro de téléphone : ne garde que les chiffres.
 * "22 26 21 22" -> "22262122"
 * "+228 22 26 21 22" -> "22822262122"
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

/**
 * Retourne les 8 chiffres locaux (sans l'indicatif pays).
 * Gère les cas :
 *   - "22 26 21 22" -> "22262122"
 *   - "+228 22 26 21 22" -> "22262122"
 *   - "0022822262122" -> "22262122"
 */
export function getLocalDigits(phone: string): string {
  const digits = cleanPhone(phone);
  // Si le numéro commence par 228 (indicatif Togo) et fait plus de 8 chiffres, on l'enlève
  if (digits.length > 8 && digits.startsWith('228')) {
    return digits.slice(3);
  }
  return digits;
}

/**
 * Formate au format international complet : "+228XXXXXXXX"
 */
export function toInternational(phone: string): string {
  const local = getLocalDigits(phone);
  return `${TOGO_COUNTRY_CODE}${local}`;
}

/**
 * Lien tel: pour déclencher l'appel téléphonique.
 */
export function toTelHref(phone: string): string {
  return `tel:${toInternational(phone)}`;
}

/**
 * Lien sms: pour ouvrir l'app SMS avec le numéro pré-rempli.
 * Sur iOS : sms:+228XXXXXXXX
 * Sur Android : sms:+228XXXXXXXX?body=encoded
 * On utilise le format simple pour compatibilité universelle.
 */
export function toSmsHref(phone: string): string {
  return `sms:${toInternational(phone)}`;
}

/**
 * Lien WhatsApp (wa.me) pour ouvrir une conversation.
 * Format : https://wa.me/228XXXXXXXX
 */
export function toWhatsAppHref(phone: string): string {
  const local = getLocalDigits(phone);
  return `https://wa.me/228${local}`;
}

/**
 * Formate pour l'affichage utilisateur : "22 26 21 22"
 */
export function toDisplay(phone: string): string {
  const local = getLocalDigits(phone);
  // Format togolais standard : XX XX XX XX
  if (local.length === 8) {
    return `${local.slice(0, 2)} ${local.slice(2, 4)} ${local.slice(4, 6)} ${local.slice(6, 8)}`;
  }
  return phone;
}

/**
 * Lien Google Maps pour rechercher la pharmacie par son nom + adresse.
 */
export function toGoogleMapsHref(name: string, address: string): string {
  const query = encodeURIComponent(`${name} ${address} Togo`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
