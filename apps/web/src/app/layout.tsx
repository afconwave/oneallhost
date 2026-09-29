import './globals.css';
import './print.css';
import type { Metadata, Viewport } from 'next';
import { Toaster } from '@oneallhost/ui';
import { JsonLd } from '../components/seo/JsonLd';
import { ProductReel } from '../components/ProductReel';
import { ConfirmHost } from '../components/ConfirmHost';

export const metadata: Metadata = {
  metadataBase: new URL('https://oneallhost.com'),
  title: 'Oneallhost — Domain Registration, Subdomain Leasing & Cloud Hosting',
  description:
    'Unified ICANN domain registrar, flexible staging subdomain rentals, and high-performance cloud hosting with native Mobile Money and Card settlement.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#091F44',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <JsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-surface-0 text-ink font-sans antialiased selection:bg-brand-blue selection:text-white">
        {children}
        <ProductReel context="checkout" />
        <ConfirmHost />
        <Toaster />
      </body>
    </html>
  );
}
