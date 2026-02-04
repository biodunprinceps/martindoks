import { NextResponse } from 'next/server';

/**
 * Health check endpoint for cPanel deployment verification
 * This endpoint responds immediately without requiring a full build
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
