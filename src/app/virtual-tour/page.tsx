import { BookingForm } from '@/components/features/BookingForm';
import { FadeIn } from '@/components/animations/FadeIn';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Calendar, Clock, MapPin } from 'lucide-react';

export default function VirtualTourPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/5 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <Video className="h-16 w-16 mx-auto mb-6 text-[#efb105]" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Virtual Tour Booking
              </h1>
              <p className="text-xl text-muted-foreground">
                Experience our properties from anywhere in the world with our immersive virtual tours
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FadeIn>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Video className="h-10 w-10 mx-auto mb-4 text-[#efb105]" />
                  <h3 className="font-bold mb-2">360° Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore every corner of our properties with immersive virtual tours
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-10 w-10 mx-auto mb-4 text-[#efb105]" />
                  <h3 className="font-bold mb-2">Flexible Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Book a time that works for you, from anywhere in the world
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-10 w-10 mx-auto mb-4 text-[#efb105]" />
                  <h3 className="font-bold mb-2">Expert Guidance</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team will guide you through each property and answer your questions
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <BookingForm />
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

