import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Hammer, PenTool, FileText, Home } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { generateBreadcrumbSchema } from '@/lib/structured-data';
import { PageHero } from '@/components/sections/PageHero';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata = generatePageMetadata({
  title: 'Construction Services in Lagos, Nigeria',
  description:
    'Comprehensive construction services in Lagos, Nigeria. Construction, Pre-Construction, Design-Build, Lump-Sum Contracting, and specialized Okon services. Over 10 years of expertise.',
  keywords: [
    'construction services Lagos',
    'construction services Nigeria',
    'pre-construction services',
    'design-build Lagos',
    'construction contractor Lagos',
    'building services Nigeria',
  ],
  path: '/services',
});

const services = [
  {
    title: 'Construction',
    description: 'Comprehensive construction services with expertise in traditional methods and cutting-edge delivery technologies.',
    icon: Building2,
  },
  {
    title: 'Pre-Construction',
    description: 'Strategic planning and preparation to ensure your project starts on the right foundation.',
    icon: Hammer,
  },
  {
    title: 'Design-Build',
    description: 'Integrated approach combining design and construction for seamless project delivery.',
    icon: PenTool,
  },
  {
    title: 'Lump-Sum Contracting',
    description: 'Fixed-price contracts providing cost certainty and peace of mind for your projects.',
    icon: FileText,
  },
  {
    title: 'Okon by Martin Doks Homes',
    description: 'Specialized service offering tailored solutions for your unique construction needs.',
    icon: Home,
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://martindokshomes.com' },
  { name: 'Services', url: 'https://martindokshomes.com/services' },
]);

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div>
        {/* Hero Section */}
        <PageHero
          title="Our Services"
          description="Delivering value through a luxury experience with comprehensive construction and real estate solutions"
          backgroundImage="/images/hero/IMG-20240124-WA0008.jpg"
        />

        {/* Services Grid */}
        <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <FadeIn key={service.title} delay={index * 0.1}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="mb-4">
                          <Icon className="h-10 w-10 text-[#efb105]" />
                        </div>
                        <CardTitle>{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {service.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
