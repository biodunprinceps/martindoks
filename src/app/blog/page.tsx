'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '@/components/features/BlogCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { blogPosts as staticPosts } from '@/data/blog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { BlogCardSkeleton } from '@/components/ui/skeleton';

// Note: Metadata should be added via a layout or separate metadata file for client components
// For now, SEO is handled via structured data in the root layout

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  // Start with static posts immediately for instant rendering
  const [allPosts, setAllPosts] = useState<BlogPost[]>(staticPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Fetch additional posts from API in the background
    const loadPosts = async () => {
      setIsRefreshing(true);
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        // Use no-store to always get fresh data, especially after admin uploads
        const response = await fetch('/api/admin/blog', {
          signal: controller.signal,
          cache: 'no-store', // Always fetch fresh data
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const posts = (data.posts || []).map((post: any) => ({
            ...post,
            publishedAt: new Date(post.publishedAt),
          }));
          
          // Combine with static posts and remove duplicates
          const combined = [...posts, ...staticPosts];
          const uniquePosts = combined.reduce((acc, current) => {
            if (!acc.find((p: BlogPost) => p.slug === current.slug)) {
              acc.push(current);
            }
            return acc;
          }, [] as BlogPost[]);
          
          setAllPosts(uniquePosts);
        }
      } catch (error: any) {
        // Silently fail - we already have static posts displayed
        if (error.name !== 'AbortError') {
          console.error('Error loading blog posts:', error);
        }
      } finally {
        setIsRefreshing(false);
      }
    };

    // Load posts after initial render
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPosts;
    }

    const query = searchQuery.toLowerCase();
    return allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        post.category?.toLowerCase().includes(query)
    );
  }, [searchQuery, allPosts]);

  const categories = useMemo(() => {
    const cats = new Set(allPosts.map((post) => post.category).filter(Boolean));
    return Array.from(cats);
  }, [allPosts]);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efb105]/5 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Our Blog</h1>
              <p className="text-xl text-muted-foreground">
                Weekly updates, industry insights, and the latest news from Martin Doks Homes
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-muted/50">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container px-4">
          {isRefreshing && filteredPosts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No blog posts found matching your search.
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <FadeIn key={post.slug} delay={index * 0.1}>
                  <BlogCard post={post} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

