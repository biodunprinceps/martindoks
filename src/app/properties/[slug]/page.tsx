import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPropertyBySlug } from "@/lib/property-storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowLeft,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { generatePageMetadata } from "@/lib/seo";
import {
  generatePropertySchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { Property } from "@/types/property";
import { FormattedText } from "@/components/ui/FormattedText";
import { RecentlyViewedTracker } from "@/components/properties/RecentlyViewedTracker";
import { PropertyInquiryForm } from "@/components/features/PropertyInquiryForm";
import { PropertyWhatsAppButton } from "@/components/features/PropertyWhatsAppButton";
import { DocumentDownload } from "@/components/features/DocumentDownload";

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const property: Property | null = await getPropertyBySlug(slug);

  if (!property) {
    return {};
  }

  return generatePageMetadata({
    title: `${property.title} - Luxury Property in ${property.location}`,
    description: property.description,
    keywords: [
      `property ${property.location}`,
      `real estate ${property.location}`,
      `construction project ${property.location}`,
      property.status === "ongoing" ? "ongoing construction Lagos" : "",
      property.status === "completed" ? "completed projects Lagos" : "",
    ].filter(Boolean) as string[],
    path: `/properties/${property.slug}`,
    image: property.featuredImage,
  });
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const property: Property | null = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Handle both local and external image URLs
  const imageUrl = property.featuredImage.startsWith("http")
    ? property.featuredImage
    : `https://martindokshomes.com${property.featuredImage}`;

  const propertySchema = generatePropertySchema({
    name: property.title,
    description: property.description,
    url: `https://martindokshomes.com/properties/${property.slug}`,
    image: imageUrl,
    address: property.location,
    price: property.price,
    numberOfBedrooms: property.bedrooms,
    numberOfBathrooms: property.bathrooms,
    floorSize: property.squareFeet,
  });

  // Determine parent page based on property type
  const parentPage =
    property.type === "construction"
      ? { name: "Portfolio", url: "https://martindokshomes.com/portfolio" }
      : { name: "Listings", url: "https://martindokshomes.com/listings" };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://martindokshomes.com" },
    parentPage,
    {
      name: property.title,
      url: `https://martindokshomes.com/properties/${property.slug}`,
    },
  ]);

  const statusColors = {
    ongoing: "bg-blue-500",
    completed: "bg-green-500",
    upcoming: "bg-[#efb105]",
  };

  const statusLabels = {
    ongoing: "Ongoing",
    completed: "Completed",
    upcoming: "Upcoming",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <RecentlyViewedTracker propertyId={property.id} />
      <div>
        {/* Hero Image */}
        <section className="relative h-[60vh] min-h-[400px]">
          <Image
            src={property.featuredImage}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container">
              <FadeIn>
                <Button
                  href={
                    property.type === "construction"
                      ? "/portfolio"
                      : "/listings"
                  }
                  variant="outline"
                  className="mb-4 bg-white/10 border-white text-white hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to{" "}
                  {property.type === "construction" ? "Portfolio" : "Listings"}
                </Button>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={statusColors[property.status]}>
                    {statusLabels[property.status]}
                  </Badge>
                  <div className="flex items-center text-white/80">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {property.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center text-white/90">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <FadeIn>
                  <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                  <div className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    <FormattedText content={property.description} />
                  </div>

                  {/* Property Details */}
                  {(property.bedrooms ||
                    property.bathrooms ||
                    property.squareFeet) && (
                    <Card className="mb-8">
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-bold mb-4">
                          Property Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {property.bedrooms && (
                            <div className="flex items-center space-x-2">
                              <Bed className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-semibold">
                                  {property.bedrooms}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Bedrooms
                                </div>
                              </div>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center space-x-2">
                              <Bath className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-semibold">
                                  {property.bathrooms}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Bathrooms
                                </div>
                              </div>
                            </div>
                          )}
                          {property.squareFeet && (
                            <div className="flex items-center space-x-2">
                              <Square className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-semibold">
                                  {property.squareFeet}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Square Feet
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Gallery */}
                  {property.images && property.images.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Gallery</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {property.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative h-64 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={image}
                              alt={`${property.title} - Image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Property Inquiry Form */}
                  <div className="mt-8">
                    <PropertyInquiryForm property={property} />
                  </div>

                  {/* Document Download */}
                  <div className="mt-8">
                    <DocumentDownload property={property} />
                  </div>
                </FadeIn>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <FadeIn delay={0.2}>
                  <Card className="sticky top-24">
                    <CardContent className="pt-6">
                      {property.price && (
                        <div className="mb-6">
                          <div className="text-sm text-muted-foreground mb-1">
                            Price
                          </div>
                          <div className="text-3xl font-bold text-primary">
                            {property.price}
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Status
                          </div>
                          <Badge className={statusColors[property.status]}>
                            {statusLabels[property.status]}
                          </Badge>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Location
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{property.location}</span>
                          </div>
                        </div>

                        <PropertyWhatsAppButton
                          property={property}
                          variant="inline"
                          className="w-full justify-center"
                        />

                        {property.virtualTourUrl && (
                          <Button
                            href={`/virtual-tour?property=${property.id}`}
                            className="w-full"
                            size="lg"
                          >
                            Schedule Virtual Tour
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Floating WhatsApp Button */}
        <PropertyWhatsAppButton property={property} variant="floating" />
      </div>
    </>
  );
}
