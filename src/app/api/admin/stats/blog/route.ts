import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog-storage';
import { blogPosts as staticPosts } from '@/data/blog';

export async function GET() {
  try {
    let posts;
    try {
      posts = await getAllBlogPosts();
      if (posts.length === 0) {
        posts = staticPosts;
      }
    } catch {
      posts = staticPosts;
    }
    
    return NextResponse.json({
      count: posts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load blog stats' },
      { status: 500 }
    );
  }
}

