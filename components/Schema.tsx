import { site } from '@/lib/site';

/** JSON-LD: ConstructionCompany + LocalBusiness для SEO. */
export function Schema({ description }: { description: string }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': ['GeneralContractor', 'LocalBusiness'],
    name: site.legalName,
    alternateName: 'PROFMONOLITH',
    description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    foundingDate: '2008',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Griboyedov 54/1',
      addressLocality: 'Yerevan',
      addressCountry: 'AM',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: { '@type': 'Country', name: 'Armenia' },
    knowsLanguage: ['hy', 'ru', 'en'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
