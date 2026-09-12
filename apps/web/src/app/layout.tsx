import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@oneallhost/ui';

export const metadata: Metadata = {
  title: 'Oneallhost — Domain Registration, Subdomain Leasing & Cloud Hosting',
  description: 'Unified ICANN domain registrar, flexible staging subdomain rentals, and high-performance cloud hosting with native Mobile Money and Card settlement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Font: Plus Jakarta Sans (Universal Platform Typography) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />

        {/* Bootstrap Icons CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        {/* Font Awesome 6 Free CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-surface-0 text-ink font-sans antialiased selection:bg-brand-blue selection:text-white">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
