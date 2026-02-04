import { FadeIn } from '@/components/animations/FadeIn';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingConfirmationPage() {
  return (
    <div>
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/5 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <CheckCircle className="h-16 w-16 mx-auto mb-6 text-[#efb105]" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Booking Confirmed!
              </h1>
              <p className="text-xl text-muted-foreground">
                Thank you for scheduling your virtual tour. We'll be in touch shortly to confirm the details.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-[#efb105] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Confirmation Email</h3>
                        <p className="text-sm text-muted-foreground">
                          You'll receive a confirmation email with all the details of your virtual tour booking.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-[#efb105] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Team Contact</h3>
                        <p className="text-sm text-muted-foreground">
                          Our team will contact you within 24 hours to finalize the tour details and answer any questions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-[#efb105] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Tour Link</h3>
                        <p className="text-sm text-muted-foreground">
                          You'll receive a secure link to access your virtual tour at the scheduled time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t">
                    <h3 className="font-semibold mb-4">Need to make changes?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you need to reschedule or have any questions, please contact us:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#efb105]" />
                        <span>info@martindokshomes.com</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#efb105]" />
                          <span>+2349139694471</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Button href="/listings" variant="outline" className="flex-1">
                      Browse Listings
                    </Button>
                    <Button href="/" className="flex-1 bg-[#efb105] hover:bg-[#d9a004] text-black">
                      Back to Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

