import { NextRequest, NextResponse } from "next/server";
import {
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/blog-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log("Admin API: Loading blog post by slug:", slug);

    const post = await getBlogPostBySlug(slug);

    if (!post) {
      console.log("Admin API: Blog post not found:", slug);
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Blog post found:", post.title);
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Admin API: Error loading blog post:", error);
    return NextResponse.json(
      { error: "Failed to load blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    console.log("Admin API: Attempting to update blog post:", slug);

    const existingPost = await getBlogPostBySlug(slug);
    if (!existingPost) {
      console.log("Admin API: Blog post not found for update:", slug);
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Updating blog post:", existingPost.title);
    const post = await updateBlogPost(slug, {
      ...body,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      status: body.status,
      scheduledPublishAt: body.scheduledPublishAt
        ? new Date(body.scheduledPublishAt)
        : undefined,
    });

    if (!post) {
      console.error("Admin API: Failed to update blog post:", slug);
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Blog post updated successfully:", slug);
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Admin API: Error updating blog post:", error);
    return NextResponse.json(
      { error: String(error) || "Failed to update blog post" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log("Admin API: Attempting to delete blog post:", slug);

    const storagePost = await getBlogPostBySlug(slug);
    if (!storagePost) {
      console.log("Admin API: Blog post not found for deletion:", slug);
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Deleting blog post:", storagePost.title);
    const deleted = await deleteBlogPost(slug);

    if (!deleted) {
      console.error("Admin API: Failed to delete blog post:", slug);
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    console.log("Admin API: Blog post deleted successfully:", slug);
    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Admin API: Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
