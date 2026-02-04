import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDatabaseEnabled } from '@/lib/db-config';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// GET - Fetch media files
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folder = searchParams.get('folder');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (isDatabaseEnabled() && prisma) {
      const where = folder ? { folder } : {};
      const [files, total] = await Promise.all([
        prisma.mediaFile.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.mediaFile.count({ where }),
      ]);

      return NextResponse.json({ files, total, limit, offset });
    } else {
      // Fallback to localStorage
      const stored = typeof window !== 'undefined' ? localStorage.getItem('media_files') : null;
      const allFiles = stored ? JSON.parse(stored) : [];
      const filtered = folder ? allFiles.filter((f: any) => f.folder === folder) : allFiles;
      const files = filtered.slice(offset, offset + limit);
      return NextResponse.json({ files, total: filtered.length, limit, offset });
    }
  } catch (error: any) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
}

// POST - Upload media file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string | null;
    const altText = formData.get('altText') as string | null;
    const uploadedBy = formData.get('uploadedBy') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Process image with Sharp
    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Generate thumbnail
    const thumbnail = await image
      .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Compress main image
    const compressed = await image
      .webp({ quality: 85 })
      .toBuffer();

    // Save files (in production, upload to S3/Cloudinary)
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const mainPath = join(uploadsDir, filename);
    const thumbPath = join(uploadsDir, `thumb-${filename}`);

    await writeFile(mainPath, compressed);
    await writeFile(thumbPath, thumbnail);

    const url = `/uploads/${filename}`;
    const thumbnailUrl = `/uploads/thumb-${filename}`;

    // Save to database
    if (isDatabaseEnabled() && prisma) {
      const mediaFile = await prisma.mediaFile.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: compressed.length,
          width: metadata.width || undefined,
          height: metadata.height || undefined,
          url,
          thumbnailUrl,
          altText: altText || undefined,
          folder: folder || undefined,
          uploadedBy: uploadedBy || undefined,
        },
      });

      return NextResponse.json(mediaFile);
    } else {
      // Fallback to localStorage
      const stored = typeof window !== 'undefined' ? localStorage.getItem('media_files') : null;
      const files = stored ? JSON.parse(stored) : [];
      const newFile = {
        id: Date.now().toString(),
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: compressed.length,
        width: metadata.width,
        height: metadata.height,
        url,
        thumbnailUrl,
        altText: altText || undefined,
        folder: folder || undefined,
        uploadedBy: uploadedBy || undefined,
        createdAt: new Date().toISOString(),
      };
      files.push(newFile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('media_files', JSON.stringify(files));
      }
      return NextResponse.json(newFile);
    }
  } catch (error: any) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media file' },
      { status: 500 }
    );
  }
}

