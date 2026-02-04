import { NextRequest, NextResponse } from 'next/server';
import {
  getVersions,
  getVersion,
  createVersion,
  compareVersions,
} from '@/lib/version-history';

// GET - Fetch versions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const version = searchParams.get('version');
    const version1 = searchParams.get('version1');
    const version2 = searchParams.get('version2');

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'entityType and entityId are required' },
        { status: 400 }
      );
    }

    // Compare versions
    if (version1 && version2) {
      const comparison = await compareVersions(
        entityType,
        entityId,
        parseInt(version1),
        parseInt(version2)
      );
      if (!comparison) {
        return NextResponse.json(
          { error: 'Versions not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(comparison);
    }

    // Get specific version
    if (version) {
      const v = await getVersion(entityType, entityId, parseInt(version));
      if (!v) {
        return NextResponse.json(
          { error: 'Version not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(v);
    }

    // Get all versions
    const versions = await getVersions(entityType, entityId);
    return NextResponse.json({ versions });
  } catch (error: any) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

// POST - Create new version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const version = await createVersion(body);
    return NextResponse.json(version);
  } catch (error: any) {
    console.error('Error creating version:', error);
    return NextResponse.json(
      { error: 'Failed to create version' },
      { status: 500 }
    );
  }
}

