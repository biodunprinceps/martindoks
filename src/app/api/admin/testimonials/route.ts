import { NextRequest, NextResponse } from "next/server";
import {
  getAllTestimonials,
  createTestimonial,
} from "@/lib/testimonial-storage";

export async function GET() {
  try {
    console.log("Admin API: Loading testimonials from storage");
    // Load from data/testimonials.json file ONLY
    const testimonials = await getAllTestimonials();
    console.log("Admin API: Loaded", testimonials.length, "testimonials");

    // Reduced cache time to ensure new testimonials appear quickly
    // Frontend uses no-store, but this helps with CDN/edge caching
    return NextResponse.json(
      { testimonials },
      {
        headers: {
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin API: Error loading testimonials:", error);
    return NextResponse.json(
      { error: String(error) || "Failed to load testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.content || !body.role) {
      return NextResponse.json(
        { error: "Name, role, and content are required" },
        { status: 400 }
      );
    }

    // Validate rating (1-5)
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const testimonial = await createTestimonial({
      name: body.name,
      role: body.role,
      company: body.company || undefined,
      content: body.content,
      image: body.image || undefined,
      rating: body.rating || 5,
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create testimonial" },
      { status: 400 }
    );
  }
}
