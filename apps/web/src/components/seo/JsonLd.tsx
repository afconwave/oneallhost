import React from 'react';

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://oneallhost.com/#organization',
        name: 'Oneallhost',
        legalName: 'Oneallhost Inc.',
        url: 'https://oneallhost.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://oneallhost.com/brand/logo-mark.png',
          width: '512',
          height: '512',
          caption: 'Oneallhost Brand Logo',
        },
        image: 'https://oneallhost.com/brand/logo-horizontal.png',
        description:
          'Unified ICANN domain registrar, flexible staging subdomain rentals, and high-performance cloud hosting with native Mobile Money and Card settlement.',
        sameAs: [
          'https://twitter.com/oneallhost',
          'https://x.com/oneallhost',
          'https://linkedin.com/company/oneallhost',
          'https://facebook.com/oneallhost',
          'https://github.com/oneallhost',
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+237-670-000-000',
            contactType: 'customer service',
            email: 'support@oneallhost.com',
            areaServed: ['CM', 'CI', 'SN', 'NG', 'GH', 'Global'],
            availableLanguage: ['English', 'French'],
          },
          {
            '@type': 'ContactPoint',
            contactType: 'billing support',
            email: 'billing@oneallhost.com',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://oneallhost.com/#website',
        url: 'https://oneallhost.com',
        name: 'Oneallhost',
        description:
          'Unified ICANN domain registrar, flexible staging subdomain rentals, and high-performance cloud hosting with native Mobile Money and Card settlement.',
        publisher: {
          '@id': 'https://oneallhost.com/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://oneallhost.com/domains/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://oneallhost.com/#service-domains',
        name: 'ICANN Domain Registration & Staging Subdomain Rentals',
        provider: {
          '@id': 'https://oneallhost.com/#organization',
        },
        description:
          'Subdomain staging leases with 100% purchase rebate credit towards permanent ICANN domain registrations.',
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Domain & Cloud Hosting Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Domain Registration',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Subdomain Staging Leases',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'High Performance NVMe Cloud Hosting',
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
