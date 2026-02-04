import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://martindokshomes.com';
const siteName = 'Martin Doks Homes';
const defaultDescription = 'Leading construction and real estate company in Lagos, Nigeria. Over 10 years of expertise in luxury residential and commercial developments.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Luxury Construction & Real Estate in Lagos, Nigeria`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    'construction company Lagos',
    'real estate Lagos',
    'construction Nigeria',
    'real estate Nigeria',
    'luxury homes Lagos',
    'residential construction Lagos',
    'commercial construction Lagos',
    'property development Lagos',
    'construction services Nigeria',
    'real estate developer Lagos',
    'building contractor Lagos',
    'construction company Nigeria',
    'property developer Nigeria',
    'luxury real estate Lagos',
    'construction projects Lagos',
  ],
  authors: [{ name: 'Martin Doks Homes' }],
  creator: 'Martin Doks Homes',
  publisher: 'Martin Doks Homes',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: siteUrl,
    siteName,
    title: `${siteName} | Luxury Construction & Real Estate in Lagos, Nigeria`,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Martin Doks Homes - Luxury Construction & Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Luxury Construction & Real Estate in Lagos, Nigeria`,
    description: defaultDescription,
    images: [`${siteUrl}/images/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  other: {
    'theme-color': '#efb105',
  },
};

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = '',
  image,
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: [...defaultMetadata.keywords || [], ...keywords],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: fullTitle,
      description,
      url,
      images: image
        ? [
            {
              url: image.startsWith('http') ? image : `${siteUrl}${image}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: fullTitle,
      description,
      images: image
        ? [image.startsWith('http') ? image : `${siteUrl}${image}`]
        : defaultMetadata.twitter?.images,
    },
    alternates: {
      canonical: url,
    },
  };
}

