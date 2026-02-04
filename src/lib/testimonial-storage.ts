import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { Testimonial } from "@/types";

const DATA_DIR = join(process.cwd(), "data");
const TESTIMONIALS_FILE = join(DATA_DIR, "testimonials.json");

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

async function loadTestimonials(): Promise<Testimonial[]> {
  try {
    await ensureDataDir();
    console.log("Loading testimonials from:", TESTIMONIALS_FILE);
    const data = await readFile(TESTIMONIALS_FILE, "utf-8");
    console.log("Testimonials file size:", data.length, "bytes");
    const testimonials = JSON.parse(data);
    console.log("Loaded testimonials count:", testimonials.length);
    return testimonials;
  } catch (error) {
    console.error("Error loading testimonials:", error);
    console.error("Attempted path:", TESTIMONIALS_FILE);
    // File doesn't exist, return empty array
    return [];
  }
}

async function saveTestimonials(testimonials: Testimonial[]): Promise<void> {
  await ensureDataDir();
  await writeFile(
    TESTIMONIALS_FILE,
    JSON.stringify(testimonials, null, 2),
    "utf-8"
  );
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return await loadTestimonials();
}

export async function getTestimonialById(
  id: string
): Promise<Testimonial | null> {
  const testimonials = await loadTestimonials();
  return testimonials.find((t) => t.id === id) || null;
}

export async function createTestimonial(
  testimonial: Omit<Testimonial, "id">
): Promise<Testimonial> {
  const testimonials = await loadTestimonials();

  const newTestimonial: Testimonial = {
    ...testimonial,
    id: crypto.randomUUID(),
  };

  testimonials.push(newTestimonial);
  await saveTestimonials(testimonials);
  return newTestimonial;
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Testimonial>
): Promise<Testimonial | null> {
  const testimonials = await loadTestimonials();
  const index = testimonials.findIndex((t) => t.id === id);

  if (index === -1) {
    return null;
  }

  testimonials[index] = {
    ...testimonials[index],
    ...updates,
  };

  await saveTestimonials(testimonials);
  return testimonials[index];
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const testimonials = await loadTestimonials();
    const initialLength = testimonials.length;
    const filtered = testimonials.filter((t) => t.id !== id);

    if (filtered.length === initialLength) {
      return false; // Testimonial not found
    }

    await saveTestimonials(filtered);
    return true;
  } catch (error: any) {
    console.error("Error in deleteTestimonial:", error);
    throw new Error(`Failed to delete testimonial: ${error.message}`);
  }
}
