/**
 * @page Pharmacies de Garde au Togo
 * @description Layout racine avec SEO complet : metadata, Open Graph, Twitter,
 * JSON-LD structured data, lang, hreflang, etc.
 */

import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerRegistrar } from '@/components/pharmacy/service-worker-registrar';
import { JsonLd } from '@/components/seo/json-ld';
import {
  websiteJsonLd,
  organizationJsonLd,
  faqJsonLd,
} from '@/lib/structured-data';
import {
  SITE_NAME,
  SITE_SHORT_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_AUTHOR,
  SITE_LOCALE,
  SITE_URL,
  THEME_COLOR,
  canonicalUrl,
  buildOpenGraph,
  buildTwitterCard,
} from '@/lib/seo-config';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Autoriser le zoom pour l'accessibilité (et SEO)
  userScalable: true,
  themeColor: THEME_COLOR,
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 48 pharmacies de garde au Togo (Lomé)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_SHORT_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  creator: SITE_AUTHOR,
  publisher: SITE_AUTHOR,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: true, // Inverse de la version kiosk : on AUTORISE la détection de téléphone
    email: false,
    address: true,
    date: false,
  },
  alternates: {
    canonical: canonicalUrl('/'),
    languages: {
      'fr-TG': canonicalUrl('/'),
      'fr-FR': canonicalUrl('/'),
      x_default: canonicalUrl('/'),
    },
  },
  openGraph: buildOpenGraph({
    title: `${SITE_NAME} | 48 pharmacies de garde au Togo`,
    description: SITE_SHORT_DESCRIPTION,
    url: canonicalUrl('/'),
  }),
  twitter: buildTwitterCard({
    title: `${SITE_NAME} | 48 pharmacies de garde au Togo`,
    description: SITE_SHORT_DESCRIPTION,
  }),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  category: 'health',
  bookmarks: [canonicalUrl('/')],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PharmasTogo',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    shortcut: '/favicon.ico',
  },
  archives: [canonicalUrl('/')],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts pour performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Apple touch icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PharmasTogo" />

        {/* Mobile web app capable */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Theme color (pour Chrome Android) */}
        <meta name="theme-color" content={THEME_COLOR} />

        {/* Données structurées JSON-LD : Organization + WebSite + FAQ */}
        <JsonLd id="ld-organization" data={organizationJsonLd()} />
        <JsonLd id="ld-website" data={websiteJsonLd()} />
        <JsonLd id="ld-faq" data={faqJsonLd()} />
      </head>
      <body
        className={`${montserrat.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        {children}
        <Toaster />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
