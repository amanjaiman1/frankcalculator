import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Space_Grotesk } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import CookieConsent from '@/components/CookieConsent';
import PageTransitionProvider from '@/components/transition/PageTransition';
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  ADSENSE_CLIENT,
  ADSENSE_ENABLED,
  websiteLd,
  organizationLd,
} from '@/lib/seo';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'financial calculator',
    'free financial calculators',
    'loan calculator',
    'personal loan calculator',
    'compound interest calculator',
    'SIP calculator',
    'debt payoff calculator',
    'credit card payoff calculator',
    'business loan calculator',
    'retirement calculator',
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.svg',
  },
  ...(ADSENSE_ENABLED
    ? { other: { 'google-adsense-account': ADSENSE_CLIENT } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen bg-dark-base text-foreground font-sans antialiased">
        <JsonLd data={websiteLd()} />
        <JsonLd data={organizationLd()} />
        {ADSENSE_ENABLED && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
        <PageTransitionProvider>
          <Navigation />
          <main className="pt-16">{children}</main>
          <Footer />
          <CookieConsent />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
