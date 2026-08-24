import './globals.css';
import type { Metadata } from 'next';
import { SmoothScroll } from '../components/SmoothScroll';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* Fontshare: Clash Display for Headlines & Satoshi for Body Text */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,600,700,900&display=swap"
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
      <body className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#1B6FC9] selection:text-white">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
