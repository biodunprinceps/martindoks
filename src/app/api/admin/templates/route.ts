import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDatabaseEnabled } from '@/lib/db-config';

// GET - Fetch templates
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    if (isDatabaseEnabled() && prisma) {
      const where: any = {};
      if (type) where.type = type;
      if (category) where.category = category;

      const templates = await prisma.contentTemplate.findMany({
        where,
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' },
        ],
      });

      return NextResponse.json({ templates });
    } else {
      // Fallback to localStorage
      const stored = typeof window !== 'undefined' ? localStorage.getItem('content_templates') : null;
      const allTemplates = stored ? JSON.parse(stored) : [];
      const filtered = allTemplates.filter((t: any) => {
        if (type && t.type !== type) return false;
        if (category && t.category !== category) return false;
        return true;
      });
      return NextResponse.json({ templates: filtered });
    }
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST - Create template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, category, content, description, isDefault, createdBy } = body;

    if (!name || !type || !content) {
      return NextResponse.json(
        { error: 'Name, type, and content are required' },
        { status: 400 }
      );
    }

    if (isDatabaseEnabled() && prisma) {
      // If this is set as default, unset other defaults of the same type
      if (isDefault) {
        await prisma.contentTemplate.updateMany({
          where: { type, isDefault: true },
          data: { isDefault: false },
        });
      }

      const template = await prisma.contentTemplate.create({
        data: {
          name,
          type,
          category: category || undefined,
          content: JSON.parse(JSON.stringify(content)),
          description: description || undefined,
          isDefault: isDefault || false,
          createdBy: createdBy || undefined,
        },
      });

      return NextResponse.json(template);
    } else {
      // Fallback to localStorage
      const stored = typeof window !== 'undefined' ? localStorage.getItem('content_templates') : null;
      const templates = stored ? JSON.parse(stored) : [];
      const newTemplate = {
        id: Date.now().toString(),
        name,
        type,
        category: category || undefined,
        content,
        description: description || undefined,
        isDefault: isDefault || false,
        createdBy: createdBy || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      templates.push(newTemplate);
      if (typeof window !== 'undefined') {
        localStorage.setItem('content_templates', JSON.stringify(templates));
      }
      return NextResponse.json(newTemplate);
    }
  } catch (error: any) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

