/**
 * @page /pharmacie/[slug]
 * @description Page dédiée à une pharmacie de garde — landing page SEO ciblée.
 *
 * Chaque pharmacie a sa propre URL indexable :
 *   /pharmacie/pharmacie-bon-secours
 *   /pharmacie/pharmacie-espace-vie
 *
 * Cette page est Server-Side Rendered (SSR) avec toutes les infos pharmacie
 * embeddées dans le HTML pour que Google puisse les indexer.
 *
 * Structured data : Pharmacy schema (rich snippets Google)
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Phone,
  MessageSquare,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Home,
  Search,
} from 'lucide-react';
import { SCRAPED_PHARMACIES } from '@/server/data/scraped-pharmacies';
import {
  toTelHref,
  toSmsHref,
  toWhatsAppHref,
  toGoogleMapsHref,
  toDisplay,
  toInternational,
} from '@/lib/format-phone';
import { JsonLd } from '@/components/seo/json-ld';
import {
  pharmacyJsonLd,
  breadcrumbJsonLd,
} from '@/lib/structured-data';
import {
  SITE_URL,
  SITE_NAME,
  canonicalUrl,
  buildOpenGraph,
  buildTwitterCard,
} from '@/lib/seo-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Génère les 48 pages statiques à la build (SSG) — meilleur SEO */
export async function generateStaticParams() {
  return SCRAPED_PHARMACIES.map((p) => ({ slug: p.id }));
}

/** Métadonnées dynamiques par pharmacie */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pharmacy = SCRAPED_PHARMACIES.find((p) => p.id === slug);

  if (!pharmacy) {
    return {
      title: 'Pharmacie introuvable',
      robots: { index: false, follow: false },
    };
  }

  const title = `${pharmacy.name} - Pharmacie de garde au Togo | Coordonnées, Appel, WhatsApp`;
  const description = `${pharmacy.name} est une pharmacie de garde au Togo située à ${pharmacy.address}. Téléphone : ${pharmacy.phones
    .map((p) => toInternational(p))
    .join(', ')}. Appelez directement ou contactez via WhatsApp. Ouvert 24h/24.`;
  const url = canonicalUrl(`/pharmacie/${pharmacy.id}`);

  return {
    title,
    description,
    keywords: [
      pharmacy.name,
      `${pharmacy.name} Togo`,
      `${pharmacy.name} pharmacie de garde`,
      `${pharmacy.name} téléphone`,
      `${pharmacy.name} adresse`,
      `pharmacie de garde ${pharmacy.address}`,
      'pharmacie de garde Togo',
      'pharmacie Lomé',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: buildOpenGraph({
      title,
      description,
      url,
      type: 'article',
    }),
    twitter: buildTwitterCard({ title, description }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function PharmacyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pharmacy = SCRAPED_PHARMACIES.find((p) => p.id === slug);

  if (!pharmacy) {
    notFound();
  }

  const primaryPhone = pharmacy.phones[0];
  const updatedPharmacy = { ...pharmacy, scrapedAt: new Date().toISOString() };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Données structurées JSON-LD pour rich snippets Google */}
      <JsonLd id="ld-pharmacy" data={pharmacyJsonLd(updatedPharmacy)} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbJsonLd([
          { name: 'Accueil', url: SITE_URL },
          { name: 'Pharmacies', url: canonicalUrl('/mobile') },
          { name: pharmacy.name, url: canonicalUrl(`/pharmacie/${pharmacy.id}`) },
        ])}
      />

      {/* Fil d'Ariane visible (breadcrumbs) */}
      <nav
        aria-label="Fil d'Ariane"
        className="bg-white border-b border-gray-200 px-4 py-2.5 text-xs text-gray-600"
      >
        <ol className="flex items-center gap-1.5 max-w-3xl mx-auto flex-wrap">
          <li>
            <Link href="/" className="hover:text-emerald-700 flex items-center gap-1">
              <Home className="w-3 h-3" />
              Accueil
            </Link>
          </li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li>
            <Link href="/mobile" className="hover:text-emerald-700">
              Pharmacies de garde
            </Link>
          </li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li className="text-gray-900 font-semibold truncate">{pharmacy.name}</li>
        </ol>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* En-tête pharmacie */}
        <header className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                {pharmacy.name}
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                Pharmacie de garde au Togo · Ouverte 24h/24
              </p>
              <div className="inline-flex items-center gap-1.5 mt-3 bg-amber-400/20 border border-amber-200/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                Disponible maintenant
              </div>
            </div>
          </div>
        </header>

        {/* Section coordonnées principales */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Adresse
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{pharmacy.address}</p>
          <a
            href={toGoogleMapsHref(pharmacy.name, pharmacy.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 active:scale-[0.98] transition-all"
          >
            <MapPin className="w-4 h-4" />
            Voir sur Google Maps
          </a>
        </section>

        {/* Section téléphone */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-600" />
            {pharmacy.phones.length > 1 ? 'Numéros de téléphone' : 'Numéro de téléphone'}
          </h2>
          <div className="space-y-2">
            {pharmacy.phones.map((phone, idx) => (
              <div
                key={`${phone}-${idx}`}
                className="border border-gray-200 rounded-xl p-3"
              >
                <p className="font-mono text-lg font-bold text-gray-900 mb-2">
                  {toDisplay(phone)}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Format international : {toInternational(phone)}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={toTelHref(phone)}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Appeler
                  </a>
                  <a
                    href={toSmsHref(phone)}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    SMS
                  </a>
                  <a
                    href={toWhatsAppHref(phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section informations */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Informations pratiques
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>
                <strong>Pharmacie de garde</strong> : assure la permanence
                24h/24 et 7j/7, y compris week-ends et jours fériés.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>
                <strong>Urgences</strong> : contactez la pharmacie par téléphone
                ou WhatsApp pour vérifier la disponibilité d&apos;un médicament
                avant de vous déplacer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>
                <strong>Depuis l&apos;étranger</strong> : composez l&apos;indicatif
                international du Togo <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">+228</code> suivi
                du numéro à 8 chiffres.
              </span>
            </li>
          </ul>
        </section>

        {/* Section SEO : contenu textuel riche (keyword-rich) */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            À propos de {pharmacy.name}
          </h2>
          <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
            <p>
              <strong>{pharmacy.name}</strong> est l&apos;une des {SCRAPED_PHARMACIES.length}{' '}
              pharmacies de garde répertoriées au Togo. Située à{' '}
              <strong>{pharmacy.address}</strong>, elle assure un service de
              permanence pour permettre aux habitants d&apos;accéder aux
              médicaments en dehors des heures d&apos;ouverture normales des
              officines.
            </p>
            <p>
              Que vous soyez à Lomé ou dans une autre ville du Togo, vous pouvez
              contacter {pharmacy.name} par téléphone au{' '}
              <strong>{primaryPhone ? toInternational(primaryPhone) : ''}</strong>,
              par SMS, ou via WhatsApp pour vérifier la disponibilité d&apos;un
              médicament avant déplacement. La pharmacie dispose d&apos;une
              équipe prête à répondre à vos urgences pharmaceutiques, de jour
              comme de nuit.
            </p>
            <p>
              Notre annuaire en ligne <strong>{SITE_NAME}</strong> recense
              l&apos;ensemble des pharmacies de garde du Togo avec leurs
              coordonnées complètes. Vous pouvez ainsi trouver rapidement une
              pharmacie ouverte près de chez vous, l&apos;appeler en un clic ou
              la localiser sur Google Maps. Le service est entièrement gratuit
              et accessible depuis n&apos;importe quel appareil mobile ou
              ordinateur.
            </p>
          </div>
        </section>

        {/* Liens internes (SEO + UX) */}
        <section className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-700" />
            Voir aussi
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/mobile"
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3" />
                Toutes les pharmacies de garde au Togo ({SCRAPED_PHARMACIES.length} pharmacies)
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold flex items-center gap-1.5"
              >
                <ChevronRight className="w-3 h-3" />
                Mode affichage kiosk (télévision, écran d&apos;accueil)
              </Link>
            </li>
          </ul>
        </section>

        {/* Pied de page SEO */}
        <footer className="text-center text-xs text-gray-400 mt-8 pb-4">
          <p>
            {pharmacy.name} — Pharmacie de garde au Togo ·{' '}
            {pharmacy.address} · {pharmacy.phones.map(toInternational).join(', ')}
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} {SITE_NAME} · Annuaire en ligne des
            pharmacies de garde au Togo
          </p>
        </footer>
      </main>
    </div>
  );
}
