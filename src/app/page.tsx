import { HeroSection } from '@/components/sections/HeroSection';
import { PropertiesSection } from '@/components/sections/PropertiesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { ContinueBrowsingSection } from '@/components/sections/ContinueBrowsingSection';
import { generatePageMetadata } from '@/lib/seo';
import { generateLocalBusinessSchema, generateRealEstateAgentSchema } from '@/lib/structured-data';

export const metadata = generatePageMetadata({
  title: 'Luxury Construction & Real Estate in Lagos, Nigeria',
  description:
    'Martin Doks Homes - Leading construction and real estate company in Lagos, Nigeria. Over 10 years of expertise in luxury residential and commercial developments. Build your home with the people you trust.',
  keywords: [
    'construction company Lagos',
    'real estate Lagos',
    'luxury homes Lagos',
    'property development Lagos',
    'construction services Nigeria',
    'real estate developer Lagos',
    'building contractor Lagos',
  ],
  path: '/',
});

export default function Home() {
  const localBusinessSchema = generateLocalBusinessSchema();
  const realEstateAgentSchema = generateRealEstateAgentSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentSchema) }}
      />
      <div>
        <HeroSection />
        <StatsSection />
        <PropertiesSection />
        <ContinueBrowsingSection />
        <TestimonialsSection />
        <NewsletterSection />
      </div>
    </>
  );
}
