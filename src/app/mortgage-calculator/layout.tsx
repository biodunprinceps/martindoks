import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Mortgage Calculator Nigeria | Free Home Loan Calculator Lagos',
  description:
    'Free mortgage calculator for Nigeria. Calculate monthly payments, down payment, and affordability for home loans in Lagos and across Nigeria. Supports NHF, MREIF, and commercial mortgage rates (3% - 28%). Plan your property purchase with our comprehensive Nigerian mortgage calculator.',
  keywords: [
    'mortgage calculator Nigeria',
    'home loan calculator Nigeria',
    'mortgage calculator Lagos',
    'NHF calculator Nigeria',
    'MREIF calculator',
    'mortgage payment calculator Nigeria',
    'home loan calculator Lagos',
    'property loan calculator Nigeria',
    'mortgage affordability calculator Nigeria',
    'down payment calculator Nigeria',
    'mortgage rate calculator Nigeria',
    'housing loan calculator Nigeria',
    'real estate calculator Lagos',
    'property finance calculator Nigeria',
    'mortgage calculator for Nigeria',
    'Nigeria mortgage calculator',
    'Lagos mortgage calculator',
    'calculate mortgage Nigeria',
    'home financing calculator Nigeria',
    'property investment calculator Nigeria',
  ],
  path: '/mortgage-calculator',
  image: '/images/hero/IMG-20240124-WA0010.jpg',
});

export default function MortgageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

