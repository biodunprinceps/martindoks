import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { format } from "date-fns";
import { FadeIn } from "@/components/animations/FadeIn";
import { generatePageMetadata } from "@/lib/seo";
import {
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
} from "@/lib/structured-data";
import { BlogPost } from "@/types/blog";

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const post: BlogPost | null = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags || [],
    path: `/blog/${post.slug}`,
    image: post.featuredImage,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post: BlogPost | null = await getBlogPostBySlug(slug);

  // Check if post exists and is published (not draft)
  if (!post) {
    notFound();
  }

  // For public view, only show published posts or scheduled posts that are ready
  const now = new Date();
  if (post.status === "draft") {
    notFound(); // Don't show drafts to public
  }
  if (
    post.status === "scheduled" &&
    post.scheduledPublishAt &&
    post.scheduledPublishAt > now
  ) {
    notFound(); // Don't show scheduled posts before their time
  }

  const blogSchema = generateBlogPostingSchema({
    title: post.title,
    description: post.excerpt,
    url: `https://martindokshomes.com/blog/${post.slug}`,
    image: post.featuredImage
      ? `https://martindokshomes.com${post.featuredImage}`
      : undefined,
    datePublished: post.publishedAt.toISOString(),
    author: post.author,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://martindokshomes.com" },
    { name: "Blog", url: "https://martindokshomes.com/blog" },
    { name: post.title, url: `https://martindokshomes.com/blog/${post.slug}` },
  ]);

  // Get all posts from storage for related posts
  let allPosts: BlogPost[] = [];
  try {
    allPosts = await getAllBlogPosts();
  } catch (error) {
    console.error("Error loading all blog posts:", error);
    allPosts = [];
  }

  // Get related posts (exclude current post)
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div>
        {/* Hero Image */}
        {post.featuredImage && (
          <section className="relative h-[50vh] min-h-[400px]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </section>
        )}

        {/* Content */}
        <article className="py-16">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <FadeIn>
                <Button href="/blog" variant="ghost" className="mb-8">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(post.publishedAt, "MMMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  {post.category && (
                    <div className="px-3 py-1 bg-[#efb105]/10 text-[#efb105] rounded-full text-xs font-semibold">
                      {post.category}
                    </div>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {post.title}
                </h1>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {post.excerpt}
                  </div>
                  <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {post.content}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container px-4">
              <FadeIn>
                <h2 className="text-3xl font-bold mb-8 text-center">
                  Related Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {relatedPosts.map((relatedPost, index) => (
                    <FadeIn key={relatedPost.slug} delay={index * 0.1}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <h3 className="text-lg font-bold mb-2 hover:text-[#efb105] transition-colors">
                              {relatedPost.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                          </Link>
                        </CardContent>
                      </Card>
                    </FadeIn>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
