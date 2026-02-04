import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDatabaseEnabled } from '@/lib/db-config';
import { logActivity } from '@/lib/activity-log';

// POST - Bulk operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, entityType, ids, data } = body;
    const user = body.user || { id: undefined, username: 'System' };

    if (!action || !entityType || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: action, entityType, and ids array are required' },
        { status: 400 }
      );
    }

    let results: any[] = [];

    if (isDatabaseEnabled() && prisma) {
      switch (action) {
        case 'delete':
          results = await bulkDelete(entityType, ids, prisma);
          break;
        case 'publish':
          results = await bulkPublish(entityType, ids, prisma);
          break;
        case 'unpublish':
          results = await bulkUnpublish(entityType, ids, prisma);
          break;
        case 'update':
          results = await bulkUpdate(entityType, ids, data, prisma);
          break;
        default:
          return NextResponse.json(
            { error: `Unknown action: ${action}` },
            { status: 400 }
          );
      }
    } else {
      // Fallback to JSON file operations (would need to implement)
      return NextResponse.json(
        { error: 'Bulk operations require database' },
        { status: 501 }
      );
    }

    // Log activity
    await logActivity({
      userId: user.id,
      username: user.username,
      action: `bulk_${action}`,
      entityType,
      entityId: ids.join(','),
      details: { count: ids.length, action, data },
    });

    return NextResponse.json({
      success: true,
      action,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation', details: error.message },
      { status: 500 }
    );
  }
}

async function bulkDelete(entityType: string, ids: string[], prisma: any) {
  const model = getModel(entityType, prisma);
  if (!model) throw new Error(`Unknown entity type: ${entityType}`);

  const result = await model.deleteMany({
    where: { id: { in: ids } },
  });

  return ids.map((id) => ({ id, deleted: true }));
}

async function bulkPublish(entityType: string, ids: string[], prisma: any) {
  const model = getModel(entityType, prisma);
  if (!model) throw new Error(`Unknown entity type: ${entityType}`);

  const result = await model.updateMany({
    where: { id: { in: ids } },
    data: { status: 'published' },
  });

  return ids.map((id) => ({ id, published: true }));
}

async function bulkUnpublish(entityType: string, ids: string[], prisma: any) {
  const model = getModel(entityType, prisma);
  if (!model) throw new Error(`Unknown entity type: ${entityType}`);

  const result = await model.updateMany({
    where: { id: { in: ids } },
    data: { status: 'draft' },
  });

  return ids.map((id) => ({ id, unpublished: true }));
}

async function bulkUpdate(entityType: string, ids: string[], data: any, prisma: any) {
  const model = getModel(entityType, prisma);
  if (!model) throw new Error(`Unknown entity type: ${entityType}`);

  const result = await model.updateMany({
    where: { id: { in: ids } },
    data,
  });

  return ids.map((id) => ({ id, updated: true }));
}

function getModel(entityType: string, prisma: any) {
  switch (entityType) {
    case 'blog_post':
      return prisma.blogPost;
    case 'property':
      return prisma.property;
    case 'testimonial':
      return prisma.testimonial;
    default:
      return null;
  }
}

