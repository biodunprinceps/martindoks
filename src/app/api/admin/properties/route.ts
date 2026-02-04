import { NextRequest, NextResponse } from "next/server";
import { getAllProperties, createProperty } from "@/lib/property-storage";

export async function GET() {
  try {
    // Load from data/properties.json file ONLY
    console.log("Admin API: Loading properties from storage");
    const props = await getAllProperties();
    console.log("Admin API: Loaded", props.length, "properties");

    // Don't fall back to static properties - use JSON file as source of truth
    return NextResponse.json(
      { properties: props },
      {
        headers: {
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin API: Error loading properties:", error);
    return NextResponse.json(
      { error: "Failed to load properties", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const property = await createProperty({
      slug: body.slug,
      title: body.title,
      description: body.description,
      location: body.location,
      price: body.price,
      type: body.type || "construction",
      status: body.status,
      images: body.images || [],
      featuredImage: body.featuredImage || body.images?.[0] || "",
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      squareFeet: body.squareFeet,
      virtualTourUrl: body.virtualTourUrl,
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create property" },
      { status: 400 }
    );
  }
}
