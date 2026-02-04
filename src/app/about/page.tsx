import { AboutSection, MissionVisionSection, ValuesSection } from '@/components/sections/AboutSection';
import { FadeIn } from '@/components/animations/FadeIn';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, TrendingUp, Award } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

export const metadata = generatePageMetadata({
  title: 'About Us - Construction & Real Estate Company in Lagos',
  description:
    'Learn about Martin Doks Homes - A beacon of innovation and excellence in Nigeria\'s construction landscape. Over 6 years of expertise delivering reliable construction solutions in Lagos.',
  keywords: [
    'about construction company Lagos',
    'construction company history Nigeria',
    'real estate company Lagos',
    'construction expertise Nigeria',
  ],
  path: '/about',
});

const stats = [
  { label: 'Years in Business', value: '6+', icon: Building2 },
  { label: 'Projects Completed', value: '20+', icon: TrendingUp },
  { label: 'Industry Recognition', value: 'Award-Winning', icon: Award },
];

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://martindokshomes.com' },
    { name: 'About Us', url: 'https://martindokshomes.com/about' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/5 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                About Martin Doks Homes
              </h1>
              <p className="text-xl text-muted-foreground">
                Building excellence in Nigeria&apos;s construction landscape for over a decade
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <FadeIn key={stat.label} delay={index * 0.1}>
                  <div className="text-center">
                    <Icon className="h-12 w-12 mx-auto mb-4" />
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-lg opacity-90">{stat.label}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <AboutSection />

      {/* Mission & Vision */}
      <MissionVisionSection />

      {/* Our Way - Resilience and Sustainability */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Way</h2>
                <h3 className="text-2xl font-semibold mb-4 text-primary">
                  Resilience and Sustainability
                </h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Our architectural designs are expertly executed with future scenarios in mind. We work to provide agile and eco-friendly construction fit for future scenarios and give value beyond current expectations.
                </p>
                <p className="text-lg text-muted-foreground">
                  Building for the best. To explore and go after new ways to build, we&apos;ve gathered the people, innovations, and partnerships that can anticipate and overcome new challenges.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-primary mb-2">Innovation</div>
                      <div className="text-muted-foreground">
                        Cutting-edge delivery technologies and traditional methods
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary mb-2">A Strong Foundation</div>
                      <div className="text-muted-foreground">
                        Over a decade of expertise in Nigeria&apos;s construction landscape
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary mb-2">Employee Owned</div>
                      <div className="text-muted-foreground">
                        Fostering unity and shared responsibility
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <ValuesSection />

      {/* Safety Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">Safety</h2>
                <h3 className="text-2xl font-semibold text-primary mb-6">
                  We watch out for each other.
                </h3>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground text-center">
                    We prioritize construction safety by fostering a sense of unity and shared responsibility among every employee and trade partner. Our approach focuses on building strong, safety-driven relationships with our trade partners, where teamwork and people take precedence over processes and checklists. By working together, we ensure a safe and cohesive environment for everyone involved.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

