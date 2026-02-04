import { TeamMemberCard } from '@/components/features/TeamMemberCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { teamMembers } from '@/data/team';
import { Button } from '@/components/ui/button';

export default function TeamPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-background">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Meet Our Leadership
              </h1>
              <p className="text-xl text-muted-foreground">
                The experienced professionals driving innovation and excellence in Nigeria's construction landscape
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16">
        <div className="container px-4">
          {teamMembers.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  Team member profiles will be displayed here.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <FadeIn key={member.id} delay={index * 0.1}>
                  <TeamMemberCard member={member} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We're always looking for talented individuals who share our passion for excellence and innovation.
              </p>
              <Button href="/contact" size="lg">
                View Careers
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

