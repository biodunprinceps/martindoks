/**
 * Database Configuration
 * 
 * This utility helps switch between JSON file storage and PostgreSQL database.
 * 
 * Set USE_DATABASE=true in .env.local to use PostgreSQL
 * Set USE_DATABASE=false (or omit) to use JSON files (default)
 */

export const USE_DATABASE = process.env.USE_DATABASE === 'true';

/**
 * Get the storage mode
 */
export function getStorageMode(): 'json' | 'database' {
  return USE_DATABASE ? 'database' : 'json';
}

/**
 * Check if database is enabled
 */
export function isDatabaseEnabled(): boolean {
  return USE_DATABASE;
}

/**
 * Validate database connection
 */
export async function validateDatabaseConnection(): Promise<boolean> {
  if (!USE_DATABASE) {
    return false;
  }

  try {
    const { prisma } = await import('./prisma');
    if (!prisma) {
      return false;
    }
    await prisma.$connect();
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('Database connection validation failed:', error);
    return false;
  }
}

