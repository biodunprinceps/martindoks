import { NextRequest, NextResponse } from 'next/server';
import { logActivity, getRecentActivities, getActivityStats } from '@/lib/activity-log';

// GET - Fetch activities
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const entityType = searchParams.get('entityType');

    let activities = await getRecentActivities(limit);

    if (entityType && entityType !== 'all') {
      activities = activities.filter((a) => a.entityType === entityType);
    }

    const stats = await getActivityStats();

    return NextResponse.json({ activities, stats });
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST - Log new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await logActivity({
      ...body,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}

