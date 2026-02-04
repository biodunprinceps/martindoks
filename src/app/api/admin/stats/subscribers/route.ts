import { NextResponse } from 'next/server';
import { getVerifiedSubscribers } from '@/lib/newsletter-storage';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const verified = await getVerifiedSubscribers();
    
    // Get total count (including unverified)
    try {
      const DATA_DIR = join(process.cwd(), 'data');
      const SUBSCRIBERS_FILE = join(DATA_DIR, 'newsletter-subscribers.json');
      const data = await readFile(SUBSCRIBERS_FILE, 'utf-8');
      const all = JSON.parse(data);
      
      return NextResponse.json({
        total: all.length,
        verified: verified.length,
        unverified: all.length - verified.length,
      });
    } catch {
      return NextResponse.json({
        total: verified.length,
        verified: verified.length,
        unverified: 0,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load subscriber stats' },
      { status: 500 }
    );
  }
}

