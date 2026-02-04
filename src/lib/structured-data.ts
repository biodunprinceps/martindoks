export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Martin Doks Homes',
    alternateName: 'MDH',
    url: 'https://martindokshomes.com',
    logo: 'https://martindokshomes.com/images/logo.png',
    description:
      'Leading construction and real estate company in Lagos, Nigeria. Over 10 years of expertise in luxury residential and commercial developments.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+2349139694471',
      contactType: 'Customer Service',
      email: 'info@martindokshomes.com',
      areaServed: 'NG',
      availableLanguage: 'en',
    },
    sameAs: [
      'https://x.com/martindokshomes',
      'https://www.instagram.com/martindoks_homes/',
      'https://www.linkedin.com/company/martin-doks-homes/',
      'https://web.facebook.com/people/Martin-Doks-Homes/61559460314565/',
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://martindokshomes.com/#organization',
    name: 'Martin Doks Homes',
    image: 'https://martindokshomes.com/images/logo.png',
    description:
      'Luxury construction and real estate development company in Lagos, Nigeria specializing in residential and commercial projects.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos',
      postalCode: '',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '6.5244',
      longitude: '3.3792',
    },
    url: 'https://martindokshomes.com',
    telephone: '+2349159162025',
    email: 'info@martindokshomes.com',
    priceRange: '$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    areaServed: {
      '@type': 'City',
      name: 'Lagos',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Construction and Real Estate Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Construction Services',
            description: 'Comprehensive construction services for residential and commercial projects',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Real Estate Development',
            description: 'Luxury real estate development and property management',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pre-Construction Services',
            description: 'Strategic planning and preparation for construction projects',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Design-Build Services',
            description: 'Integrated design and construction services',
          },
        },
      ],
    },
  };
}

export function generateRealEstateAgentSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Martin Doks Homes',
    url: 'https://martindokshomes.com',
    logo: 'https://martindokshomes.com/images/logo.png',
    description:
      'Premier real estate development and construction company in Lagos, Nigeria with over 10 years of experience.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    telephone: '+2349159162025',
    email: 'info@martindokshomes.com',
    areaServed: {
      '@type': 'City',
      name: 'Lagos',
    },
    serviceType: [
      'Residential Real Estate',
      'Commercial Real Estate',
      'Property Development',
      'Construction Services',
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Martin Doks Homes',
    url: 'https://martindokshomes.com',
    description:
      'Leading construction and real estate company in Lagos, Nigeria. Luxury residential and commercial developments.',
    publisher: {
      '@type': 'Organization',
      name: 'Martin Doks Homes',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://martindokshomes.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBlogPostingSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image || 'https://martindokshomes.com/images/og-image.jpg',
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Martin Doks Homes',
      logo: {
        '@type': 'ImageObject',
        url: 'https://martindokshomes.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generatePropertySchema({
  name,
  description,
  url,
  image,
  address,
  price,
  numberOfBedrooms,
  numberOfBathrooms,
  floorSize,
}: {
  name: string;
  description: string;
  url: string;
  image: string;
  address: string;
  price?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  floorSize?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name,
    description,
    url,
    image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
      streetAddress: address,
    },
    ...(price && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'NGN',
      },
    }),
    ...(numberOfBedrooms && { numberOfBedrooms }),
    ...(numberOfBathrooms && { numberOfBathrooms }),
    ...(floorSize && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: floorSize,
        unitCode: 'SQM',
      },
    }),
  };
}

