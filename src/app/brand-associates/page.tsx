import { BrandLogo } from '@/components/features/BrandLogo';
import { FadeIn } from '@/components/animations/FadeIn';
import { brandAssociates } from '@/data/brandAssociates';
import { Handshake } from 'lucide-react';

export default function BrandAssociatesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/5 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <Handshake className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Brand Associates
              </h1>
              <p className="text-xl text-muted-foreground">
                Trusted partners and collaborators who share our commitment to excellence
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Brand Associates Grid */}
      <section className="py-16">
        <div className="container px-4">
          {brandAssociates.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  Brand associates and partners will be displayed here.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {brandAssociates.map((brand, index) => (
                <FadeIn key={brand.id} delay={index * 0.1}>
                  <BrandLogo brand={brand} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

