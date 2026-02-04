'use client';

import { FadeIn } from '@/components/animations/FadeIn';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Shield, Lightbulb, Leaf, Users } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Who We Are</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A beacon of innovation and excellence in Nigeria's construction landscape, driven by a legacy of over a decade of expertise in the industry. We are renowned for our unwavering commitment to delivering reliable solutions to the most intricate construction challenges, earning recognition as a leader for our mastery of traditional methods and pioneering use of cutting-edge delivery technologies.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function MissionVisionSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeIn>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Creating Value Beyond Construction and Real Estate.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Our vision at Martin Doks Homes (MDH) is to redefine the construction landscape by consistently delivering innovative and sustainable solutions that exceed client expectations. By leveraging our expertise and embracing emerging technologies, we aim to be at the forefront of shaping the industry's future, setting new standards for excellence and reliability.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function ValuesSection() {
  const values = [
    {
      title: 'Resilience and Sustainability',
      description: 'Our architectural designs are expertly executed with future scenarios in mind. We work to provide agile and eco-friendly construction fit for future scenarios and give value beyond current expectations.',
      icon: Leaf,
    },
    {
      title: 'Safety First',
      description: 'We prioritize construction safety by fostering a sense of unity and shared responsibility among every employee and trade partner. Our approach focuses on building strong, safety-driven relationships.',
      icon: Shield,
    },
    {
      title: 'Innovation',
      description: 'To explore and go after new ways to build, we\'ve gathered the people, innovations, and partnerships that can anticipate and overcome new challenges.',
      icon: Lightbulb,
    },
    {
      title: 'Teamwork',
      description: 'We watch out for each other. By working together, we ensure a safe and cohesive environment for everyone involved.',
      icon: Users,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <FadeIn key={value.title} delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

