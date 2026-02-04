import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { BlogPost } from "@/types/blog";

const DATA_DIR = join(process.cwd(), "data");
const BLOG_FILE = join(DATA_DIR, "blog-posts.json");

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    await ensureDataDir();
    console.log("Loading blog posts from:", BLOG_FILE);
    const data = await readFile(BLOG_FILE, "utf-8");
    console.log("Blog file size:", data.length, "bytes");
    const posts = JSON.parse(data);
    console.log("Loaded blog posts count:", posts.length);
    return posts.map((post: any) => ({
      ...post,
      publishedAt: new Date(post.publishedAt),
      scheduledPublishAt: post.scheduledPublishAt
        ? new Date(post.scheduledPublishAt)
        : undefined,
      status: post.status || "published", // Default to published for backward compatibility
    }));
  } catch (error) {
    console.error("Error loading blog posts:", error);
    console.error("Attempted path:", BLOG_FILE);
    // File doesn't exist, return empty array
    return [];
  }
}

// Auto-publish scheduled posts that have passed their scheduled time
async function autoPublishScheduledPosts(): Promise<void> {
  const posts = await loadBlogPosts();
  const now = new Date();
  let updated = false;

  const updatedPosts = posts.map((post) => {
    if (
      post.status === "scheduled" &&
      post.scheduledPublishAt &&
      post.scheduledPublishAt <= now
    ) {
      updated = true;
      return {
        ...post,
        status: "published" as const,
        publishedAt: post.scheduledPublishAt,
        scheduledPublishAt: undefined,
      };
    }
    return post;
  });

  if (updated) {
    await saveBlogPosts(updatedPosts);
  }
}

async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  await ensureDataDir();
  await writeFile(BLOG_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export async function getAllBlogPosts(
  includeDrafts: boolean = false
): Promise<BlogPost[]> {
  // Auto-publish scheduled posts first
  await autoPublishScheduledPosts();

  const posts = await loadBlogPosts();

  if (includeDrafts) {
    return posts;
  }

  // Filter out drafts and only return published posts
  return posts.filter((post) => post.status === "published" || !post.status);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function createBlogPost(
  post: Omit<BlogPost, "publishedAt"> & {
    publishedAt?: Date;
    status?: BlogPost["status"];
    scheduledPublishAt?: Date;
  }
): Promise<BlogPost> {
  const posts = await loadBlogPosts();

  // Check if slug already exists
  if (posts.find((p) => p.slug === post.slug)) {
    throw new Error("A blog post with this slug already exists");
  }

  const status = post.status || "published";
  const scheduledPublishAt = post.scheduledPublishAt
    ? new Date(post.scheduledPublishAt)
    : undefined;

  // Determine publishedAt based on status
  let publishedAt: Date;
  if (status === "scheduled" && scheduledPublishAt) {
    publishedAt = scheduledPublishAt;
  } else if (status === "published") {
    publishedAt = post.publishedAt || new Date();
  } else {
    // For drafts, set publishedAt to now but it won't be visible until published
    publishedAt = post.publishedAt || new Date();
  }

  const newPost: BlogPost = {
    ...post,
    publishedAt,
    status,
    scheduledPublishAt,
  };

  posts.push(newPost);
  await saveBlogPosts(posts);
  return newPost;
}

export async function updateBlogPost(
  slug: string,
  updates: Partial<BlogPost> & { scheduledPublishAt?: Date | string }
): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) {
    return null;
  }

  // If slug is being changed, check it doesn't conflict
  if (updates.slug && updates.slug !== slug) {
    if (posts.find((p) => p.slug === updates.slug && p.slug !== slug)) {
      throw new Error("A blog post with this slug already exists");
    }
  }

  const currentPost = posts[index];
  const status = updates.status || currentPost.status || "published";
  const scheduledPublishAt = updates.scheduledPublishAt
    ? typeof updates.scheduledPublishAt === "string"
      ? new Date(updates.scheduledPublishAt)
      : updates.scheduledPublishAt
    : currentPost.scheduledPublishAt;

  // Update publishedAt based on status
  let publishedAt = currentPost.publishedAt;
  if (status === "scheduled" && scheduledPublishAt) {
    publishedAt = scheduledPublishAt;
  } else if (status === "published" && currentPost.status !== "published") {
    // If changing from draft/scheduled to published, set publishedAt to now
    publishedAt = updates.publishedAt
      ? new Date(updates.publishedAt)
      : new Date();
  } else if (updates.publishedAt) {
    publishedAt = new Date(updates.publishedAt);
  }

  posts[index] = {
    ...currentPost,
    ...updates,
    status,
    publishedAt,
    scheduledPublishAt: status === "scheduled" ? scheduledPublishAt : undefined,
  };

  await saveBlogPosts(posts);
  return posts[index];
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const posts = await loadBlogPosts();
  const filtered = posts.filter((p) => p.slug !== slug);

  if (filtered.length === posts.length) {
    return false; // Post not found
  }

  await saveBlogPosts(filtered);
  return true;
}
