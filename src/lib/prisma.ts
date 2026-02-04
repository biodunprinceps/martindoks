// Check if we should use database (set USE_DATABASE=true in .env.local)
const USE_DATABASE = process.env.USE_DATABASE === 'true';

// Conditional Prisma import - only when database is enabled
let prisma: any = null;

if (USE_DATABASE && typeof window === 'undefined') {
  // Only import on server-side
  try {
    // Dynamic import to avoid webpack issues
    const prismaModule = require('@prisma/client');
    const PrismaClient = prismaModule.PrismaClient;
    
    const globalForPrisma = globalThis as unknown as {
      prisma: any;
    };

    prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }
  } catch (error) {
    // Prisma client not generated - this is OK if not using database
    if (USE_DATABASE) {
      console.warn('Prisma Client not found. Make sure to run "npm run db:generate" if using database.');
    }
    prisma = null;
  }
}

export { prisma };

// Helper to check if database is enabled
export const isDatabaseEnabled = () => USE_DATABASE && typeof window === 'undefined';

