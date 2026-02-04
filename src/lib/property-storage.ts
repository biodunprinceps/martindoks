/**
 * Server-side property storage utilities
 * Handles file-based storage for properties (similar to blog-storage.ts and testimonial-storage.ts)
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { Property } from "@/types/property";

const DATA_DIR = join(process.cwd(), "data");
const PROPERTIES_FILE = join(DATA_DIR, "properties.json");

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

async function loadProperties(): Promise<Property[]> {
  try {
    await ensureDataDir();
    console.log("Loading properties from:", PROPERTIES_FILE);
    const data = await readFile(PROPERTIES_FILE, "utf-8");
    console.log("Properties file size:", data.length, "bytes");
    const properties = JSON.parse(data);
    console.log("Loaded properties count:", properties.length);
    return properties.map((prop: any) => ({
      ...prop,
      createdAt: new Date(prop.createdAt),
      updatedAt: new Date(prop.updatedAt),
    }));
  } catch (error) {
    console.error("Error loading properties from file:", error);
    console.error("Attempted path:", PROPERTIES_FILE);
    console.error("Current working directory:", process.cwd());
    // File doesn't exist, return empty array
    return [];
  }
}

async function saveProperties(properties: Property[]): Promise<void> {
  await ensureDataDir();
  await writeFile(
    PROPERTIES_FILE,
    JSON.stringify(properties, null, 2),
    "utf-8"
  );
}

export async function getAllProperties(): Promise<Property[]> {
  return await loadProperties();
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await loadProperties();
  return properties.find((p) => p.id === id) || null;
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  const properties = await loadProperties();
  return properties.find((p) => p.slug === slug) || null;
}

export async function createProperty(
  propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">
): Promise<Property> {
  const properties = await loadProperties();

  // Check if slug already exists
  const existingProperty = properties.find((p) => p.slug === propertyData.slug);
  if (existingProperty) {
    throw new Error(`Property with slug "${propertyData.slug}" already exists`);
  }

  const newProperty: Property = {
    ...propertyData,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  properties.push(newProperty);
  await saveProperties(properties);
  return newProperty;
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<Property | null> {
  const properties = await loadProperties();
  const index = properties.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  // If slug is being updated, check for conflicts
  if (updates.slug && updates.slug !== properties[index].slug) {
    const existingProperty = properties.find(
      (p) => p.slug === updates.slug && p.id !== id
    );
    if (existingProperty) {
      throw new Error(`Property with slug "${updates.slug}" already exists`);
    }
  }

  properties[index] = {
    ...properties[index],
    ...updates,
    updatedAt: new Date(),
  };

  await saveProperties(properties);
  return properties[index];
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    const properties = await loadProperties();
    const initialLength = properties.length;
    const filtered = properties.filter((p) => p.id !== id);

    if (filtered.length === initialLength) {
      return false; // Property not found
    }

    await saveProperties(filtered);
    return true;
  } catch (error) {
    console.error("Error deleting property:", error);
    return false;
  }
}
