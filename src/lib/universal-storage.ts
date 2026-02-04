/**
 * Universal Storage Adapter
 * - Development: Uses JSON files
 * - Production (Vercel/Netlify): Uses environment-based fallback or throws helpful error
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const isProduction = process.env.NODE_ENV === "production";
const isServerless = process.env.VERCEL || process.env.NETLIFY;

/**
 * Check if we're in a serverless/read-only environment
 */
export function isReadOnlyEnvironment(): boolean {
  return isProduction && isServerless;
}

/**
 * Read data - works in all environments
 */
export async function readData<T>(fileName: string): Promise<T[]> {
  const dataDir = join(process.cwd(), "data");
  const filePath = join(dataDir, fileName);

  try {
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return [];
  }
}

/**
 * Write data - only works locally, throws helpful error in production
 */
export async function writeData<T>(
  fileName: string,
  data: T[]
): Promise<boolean> {
  // Prevent writes in serverless environments
  if (isReadOnlyEnvironment()) {
    throw new Error(
      `❌ Cannot write to ${fileName} in serverless environment!\n\n` +
        `⚠️  SOLUTION: You need a real database!\n\n` +
        `Choose one:\n` +
        `1. Supabase (PostgreSQL) - https://supabase.com\n` +
        `2. MongoDB Atlas - https://mongodb.com/atlas\n` +
        `3. PlanetScale (MySQL) - https://planetscale.com\n\n` +
        `Or deploy to a VPS/cPanel with write access.`
    );
  }

  const dataDir = join(process.cwd(), "data");
  const filePath = join(dataDir, fileName);

  try {
    await mkdir(dataDir, { recursive: true });
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    throw error;
  }
}

/**
 * Display helpful error message for admin users
 */
export function getStorageErrorMessage(): string {
  return `
🚨 Admin Features Disabled on Serverless

Your site is deployed on ${
    process.env.VERCEL ? "Vercel" : "Netlify"
  }, which has a read-only filesystem.

To enable admin features (Create/Edit/Delete):

✅ Option 1: Use a Database (Recommended)
   • Supabase (Free PostgreSQL): https://supabase.com
   • MongoDB Atlas (Free): https://mongodb.com/atlas
   • PlanetScale (Free MySQL): https://planetscale.com

✅ Option 2: Deploy to VPS/cPanel
   • Use the martindokshomes-PRODUCTION-READY-v8-FINAL.zip
   • cPanel with Node.js support works perfectly

📖 View-only mode is active. Your site displays all data correctly!
  `;
}
