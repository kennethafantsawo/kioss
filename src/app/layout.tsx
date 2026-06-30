/**
 * @page Pharmacies de Garde au Togo
 * @description Page principale de l'application PWA
 */

import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ServiceWorkerRegistrar } from '@/components/pharmacy/service-worker-registrar';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#047857',
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  title: 'Pharmacies de Garde au Togo',
  description:
    'Trouvez facilement les pharmacies de garde au Togo. Liste mise à jour des pharmacies disponibles 24h/24 avec coordonnées complètes.',
  keywords: [
    'pharmacie',
    'garde',
    'Togo',
    'Lomé',
    'pharmacie de garde',
    'urgence',
    'santé',
  ],
  authors: [{ name: 'Pharmacies de Garde Togo' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Pharmacies de Garde au Togo',
    description:
      'Trouvez facilement les pharmacies de garde au Togo 24h/24.',
    type: 'website',
    locale: 'fr_TG',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PharmasTogo',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* Verrouillage kiosk - aucune interaction */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="email=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="date=no" />
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
