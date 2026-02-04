import { NextRequest, NextResponse } from "next/server";
import {
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/testimonial-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Admin API: Loading testimonial by ID:", id);

    const testimonial = await getTestimonialById(id);

    if (!testimonial) {
      console.log("Admin API: Testimonial not found:", id);
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Testimonial found:", id);
    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Admin API: Error loading testimonial:", error);
    return NextResponse.json(
      { error: String(error) || "Failed to load testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log("Admin API: Attempting to update testimonial:", id);

    const existingTestimonial = await getTestimonialById(id);
    if (!existingTestimonial) {
      console.log("Admin API: Testimonial not found for update:", id);
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Validate rating if provided
    if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    console.log("Admin API: Updating testimonial:", id);
    const testimonial = await updateTestimonial(id, body);

    if (!testimonial) {
      console.error("Admin API: Failed to update testimonial:", id);
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Testimonial updated successfully:", id);
    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Admin API: Error updating testimonial:", error);
    return NextResponse.json(
      { error: String(error) || "Failed to update testimonial" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Admin API: Attempting to delete testimonial:", id);

    const storageTestimonial = await getTestimonialById(id);
    if (!storageTestimonial) {
      console.log("Admin API: Testimonial not found for deletion:", id);
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Deleting testimonial:", id);
    const deleted = await deleteTestimonial(id);

    if (!deleted) {
      console.error("Admin API: Failed to delete testimonial:", id);
      return NextResponse.json(
        { error: "Failed to delete testimonial" },
        { status: 500 }
      );
    }

    console.log("Admin API: Testimonial deleted successfully:", id);
    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Admin API: Error deleting testimonial:", error);
    return NextResponse.json(
      { error: String(error) || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
