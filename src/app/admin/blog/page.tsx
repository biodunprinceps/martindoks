'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/blog';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog?includeDrafts=true');
      const data = await response.json();
      // Convert date strings to Date objects
      const posts = (data.posts || []).map((post: any) => ({
        ...post,
        publishedAt: new Date(post.publishedAt),
        scheduledPublishAt: post.scheduledPublishAt ? new Date(post.scheduledPublishAt) : undefined,
        status: post.status || 'published',
      }));
      setPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_BLOG}>
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Posts</h1>
          <p className="text-gray-600">Manage your blog posts and articles</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-[#efb105] hover:bg-[#d9a004] text-black">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">No blog posts yet</p>
              <Link href="/admin/blog/new">
                <Button variant="outline">Create Your First Post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        {post.status === 'scheduled' && post.scheduledPublishAt && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600">
                              Scheduled: {new Date(post.scheduledPublishAt).toLocaleString()}
                            </span>
                          </>
                        )}
                        {post.category && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {post.category}
                            </span>
                          </>
                        )}
                        <div className="ml-auto">
                          {post.status === 'draft' && (
                            <Badge className="bg-gray-500">Draft</Badge>
                          )}
                          {post.status === 'scheduled' && (
                            <Badge className="bg-orange-500">Scheduled</Badge>
                          )}
                          {(!post.status || post.status === 'published') && (
                            <Badge className="bg-green-500">Published</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/blog/${post.slug}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.slug)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
    </PermissionGuard>
  );
}

