export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrendingTicker from '@/components/ui/TrendingTicker';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import CommunityBanner from '@/components/layout/CommunityBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ondexy.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Ondexy – Premium IPTV Subscriptions & Streaming Plans',
    template: '%s | Ondexy',
  },
  description:
    'Shop the best IPTV subscription plans. 10,000+ channels, Full HD & 4K quality, instant activation. Best prices on IPTV, media players, and reseller panels.',
  keywords: [
    'IPTV',
    'IPTV subscription',
    'streaming',
    'live TV',
    'reseller panel',
    'media player',
    'IPTV 4K',
    'buy IPTV',
    'IPTV smarters',
    'TiviMate',
    'BEIN sports IPTV',
  ],
  authors: [{ name: 'Ondexy' }],
  creator: 'Ondexy',
  publisher: 'Ondexy',
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
  openGraph: {
    siteName: 'Ondexy',
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    title: 'Ondexy – Premium IPTV Subscriptions & Streaming Plans',
    description:
      'Shop the best IPTV subscription plans. 10,000+ channels, Full HD & 4K quality, instant activation.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Ondexy – Premium IPTV Subscriptions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ondexy – Premium IPTV Subscriptions & Streaming Plans',
    description:
      'Shop the best IPTV subscription plans. 10,000+ channels, Full HD & 4K quality, instant activation.',
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 antialiased font-[family-name:var(--font-inter)]">
        <Header />
        <main className="flex-1">{children}</main>
        <TrendingTicker />
        <CommunityBanner />
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
