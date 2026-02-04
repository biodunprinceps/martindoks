/**
 * Netlify Blobs Storage Adapter
 * Replaces file-based JSON storage with Netlify Blobs for read-write operations
 */

import { getStore } from "@netlify/blobs";

// Helper to get blob store
function getBlobStore(storeName: string) {
  if (typeof window !== "undefined") {
    throw new Error("Netlify Blobs can only be used server-side");
  }
  return getStore(storeName);
}

/**
 * Read data from Netlify Blobs
 */
export async function readBlobData<T>(
  storeName: string,
  key: string
): Promise<T | null> {
  try {
    const store = getBlobStore(storeName);
    const data = await store.get(key, { type: "json" });
    return data as T;
  } catch (error) {
    console.error(`Error reading from blob ${storeName}/${key}:`, error);
    return null;
  }
}

/**
 * Write data to Netlify Blobs
 */
export async function writeBlobData<T>(
  storeName: string,
  key: string,
  data: T
): Promise<boolean> {
  try {
    const store = getBlobStore(storeName);
    await store.setJSON(key, data);
    return true;
  } catch (error) {
    console.error(`Error writing to blob ${storeName}/${key}:`, error);
    return false;
  }
}

/**
 * List all keys in a blob store
 */
export async function listBlobKeys(storeName: string): Promise<string[]> {
  try {
    const store = getBlobStore(storeName);
    const { blobs } = await store.list();
    return blobs.map((blob) => blob.key);
  } catch (error) {
    console.error(`Error listing blobs in ${storeName}:`, error);
    return [];
  }
}

/**
 * Delete data from Netlify Blobs
 */
export async function deleteBlobData(
  storeName: string,
  key: string
): Promise<boolean> {
  try {
    const store = getBlobStore(storeName);
    await store.delete(key);
    return true;
  } catch (error) {
    console.error(`Error deleting blob ${storeName}/${key}:`, error);
    return false;
  }
}

/**
 * Migration utility: Upload initial data from JSON files to Netlify Blobs
 * Run this once to populate Blobs with your existing data
 */
export async function migrateJSONToBlobs() {
  // This function should be called from a Netlify Function
  // to populate Blobs with data from your JSON files
  console.log("Migration utility - call from Netlify Function");
}
