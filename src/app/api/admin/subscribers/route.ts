import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedSubscribers } from '@/lib/newsletter-storage';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'all';

    const DATA_DIR = join(process.cwd(), 'data');
    const SUBSCRIBERS_FILE = join(DATA_DIR, 'newsletter-subscribers.json');

    let allSubscribers: any[] = [];
    
    try {
      const data = await readFile(SUBSCRIBERS_FILE, 'utf-8');
      allSubscribers = JSON.parse(data);
    } catch {
      // File doesn't exist yet
      return NextResponse.json({ subscribers: [] });
    }

    let filtered = allSubscribers;

    if (filter === 'verified') {
      filtered = allSubscribers.filter(s => s.verified);
    } else if (filter === 'unverified') {
      filtered = allSubscribers.filter(s => !s.verified);
    }

    return NextResponse.json({
      subscribers: filtered,
    });
  } catch (error) {
    console.error('Error loading subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to load subscribers' },
      { status: 500 }
    );
  }
}

