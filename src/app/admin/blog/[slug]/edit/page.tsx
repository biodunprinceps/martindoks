'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SEOTools } from '@/components/admin/SEOTools';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { BlogPreview } from '@/components/admin/BlogPreview';

const blogPostSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().optional(),
  tags: z.string().optional(),
  publishedAt: z.string().optional(),
  featuredImage: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [publishAction, setPublishAction] = useState<'publish' | 'draft' | 'schedule'>('publish');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [currentUser, setCurrentUser] = useState<{ username: string; role?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
  });

  // Watch form values for preview
  const formValues = watch();

  useEffect(() => {
    // Get current user from sessionStorage
    const userData = sessionStorage.getItem('admin_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin' || user.username === 'admin');
    }
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${slug}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to load post');
      }
      const data = await response.json();
      const post = data.post;

      if (!post) {
        throw new Error('Blog post not found');
      }

      // Prepare form data
      const formData = {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category || '',
        tags: post.tags?.join(', ') || '',
        publishedAt: new Date(post.publishedAt).toISOString().split('T')[0],
      };
      
      // Reset form with the data (this properly sets all values)
      reset(formData);
      setFeaturedImage(post.featuredImage || '');
    } catch (error: any) {
      console.error('Error loading post:', error);
      alert(error.message || 'Failed to load blog post. Make sure the post exists.');
      router.push('/admin/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BlogPostFormData, action: 'publish' | 'draft' | 'schedule' = publishAction) => {
    setIsSubmitting(true);
    try {
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      let status: 'published' | 'draft' | 'scheduled' | undefined = undefined;
      let scheduledPublishAt: string | undefined = undefined;

      if (action === 'draft') {
        status = 'draft';
      } else if (action === 'schedule') {
        if (!scheduledDateTime) {
          alert('Please select a date and time for scheduling');
          setIsSubmitting(false);
          return;
        }
        status = 'scheduled';
        scheduledPublishAt = new Date(scheduledDateTime).toISOString();
      } else {
        status = 'published';
      }

      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tags,
          featuredImage: featuredImage || undefined,
          status,
          scheduledPublishAt,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update blog post');
      }

      router.push('/admin/blog');
    } catch (error: any) {
      alert(error.message || 'Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#efb105]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/blog">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-600">Update blog post details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, publishAction))}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    {...register('title')}
                    placeholder="Enter blog post title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <Input
                    {...register('slug')}
                    placeholder="blog-post-slug"
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    placeholder="Brief description"
                    className={`w-full px-3 py-2 border rounded-md ${errors.excerpt ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-500 mt-1">{errors.excerpt.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    {...register('content')}
                    rows={15}
                    placeholder="Blog post content (Markdown supported)"
                    className={`w-full px-3 py-2 border rounded-md font-mono text-sm ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Action
                  </label>
                  <select
                    value={publishAction}
                    onChange={(e) => setPublishAction(e.target.value as 'publish' | 'draft' | 'schedule')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="publish">Publish Now</option>
                    <option value="draft">Save as Draft</option>
                    <option value="schedule">Schedule for Later</option>
                  </select>
                </div>

                {publishAction === 'schedule' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Date & Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The post will be automatically published at this time
                    </p>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="w-full mb-2"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>

                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit((data) => onSubmit(data, publishAction))();
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-[#efb105] hover:bg-[#d9a004] text-black"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting 
                    ? (publishAction === 'draft' ? 'Saving...' : publishAction === 'schedule' ? 'Scheduling...' : 'Saving...')
                    : (publishAction === 'draft' ? 'Save as Draft' : publishAction === 'schedule' ? 'Schedule Post' : 'Save Changes')
                  }
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <Input
                    {...register('author')}
                    className={errors.author ? 'border-red-500' : ''}
                    disabled={!isAdmin}
                    title={!isAdmin ? 'Only admins can edit the author field' : ''}
                  />
                  {!isAdmin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Author can only be changed by administrators
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Input {...register('category')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input {...register('tags')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <Input type="date" {...register('publishedAt')} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={featuredImage}
                  onChange={setFeaturedImage}
                  folder="blog"
                />
              </CardContent>
            </Card>

            <SEOTools
              content={{
                title: formValues.title || '',
                description: formValues.excerpt || '',
                content: formValues.content || '',
                keywords: formValues.tags ? formValues.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
              }}
              onUpdate={(updates) => {
                if (updates.title) {
                  setValue('title', updates.title);
                }
                if (updates.description) {
                  setValue('excerpt', updates.description);
                }
              }}
            />
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <BlogPreview
          title={formValues.title || ''}
          excerpt={formValues.excerpt || ''}
          content={formValues.content || ''}
          author={formValues.author || 'Martin Doks'}
          featuredImage={featuredImage}
          category={formValues.category}
          tags={formValues.tags ? formValues.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined}
          publishedAt={formValues.publishedAt ? new Date(formValues.publishedAt) : new Date()}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

