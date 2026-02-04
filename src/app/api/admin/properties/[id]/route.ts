import { NextRequest, NextResponse } from "next/server";
import {
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "@/lib/property-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Load from data/properties.json file ONLY
    console.log("Admin API: Loading property by ID:", id);
    const property = await getPropertyById(id);

    if (!property) {
      console.log("Admin API: Property not found:", id);
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Property found:", property.title);

    // Serialize dates to ISO strings for JSON response
    const serializedProperty = {
      ...property,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
    };

    return NextResponse.json(
      { property: serializedProperty },
      {
        headers: {
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin API: Error loading property:", error);
    return NextResponse.json(
      { error: String(error) || "Failed to load property" },
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

    const property = await updateProperty(id, body);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Serialize dates to ISO strings for JSON response
    const serializedProperty = {
      ...property,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
    };

    return NextResponse.json({ property: serializedProperty });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update property" },
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
    console.log("Admin API: Attempting to delete property with ID:", id);

    // Check if property exists in storage
    const storageProperty = await getPropertyById(id);
    if (!storageProperty) {
      console.log("Admin API: Property not found for deletion:", id);
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Deleting property:", storageProperty.title);
    // Delete from data/properties.json
    const deleted = await deleteProperty(id);

    if (!deleted) {
      console.error("Admin API: Failed to delete property:", id);
      return NextResponse.json(
        { error: "Failed to delete property" },
        { status: 500 }
      );
    }

    console.log("Admin API: Property deleted successfully:", id);
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to delete property",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
