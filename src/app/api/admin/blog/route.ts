import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts, createBlogPost } from "@/lib/blog-storage";

export async function GET(request: NextRequest) {
  try {
    // Check if this is an admin request (includes drafts)
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    console.log("Admin API: Loading blog posts, includeDrafts:", includeDrafts);
    // Load from data/blog-posts.json file ONLY
    let posts = await getAllBlogPosts(includeDrafts);
    console.log("Admin API: Loaded", posts.length, "blog posts");

    // For public view, filter out drafts and scheduled posts that aren't ready
    if (!includeDrafts) {
      const now = new Date();
      posts = posts.filter((post) => {
        // Only show published posts
        if (post.status === "published" || !post.status) {
          return true;
        }
        // Show scheduled posts if their time has come
        if (
          post.status === "scheduled" &&
          post.scheduledPublishAt &&
          post.scheduledPublishAt <= now
        ) {
          return true;
        }
        return false;
      });
      console.log(
        "Admin API: After filtering,",
        posts.length,
        "published posts"
      );
    }

    // Minimal cache time to ensure new posts appear quickly
    // Frontend uses no-store, but this helps with CDN/edge caching
    return NextResponse.json(
      { posts },
      {
        headers: {
          "Cache-Control": "public, s-maxage=0, stale-while-revalidate=0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const post = await createBlogPost({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author || "Martin Doks",
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      featuredImage: body.featuredImage,
      tags: body.tags || [],
      category: body.category,
      status: body.status || "published",
      scheduledPublishAt: body.scheduledPublishAt
        ? new Date(body.scheduledPublishAt)
        : undefined,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create blog post" },
      { status: 400 }
    );
  }
}
