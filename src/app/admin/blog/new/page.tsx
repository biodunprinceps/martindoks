'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SEOTools } from '@/components/admin/SEOTools';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
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

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [publishAction, setPublishAction] = useState<'publish' | 'draft' | 'schedule'>('publish');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      author: '',
      publishedAt: new Date().toISOString().split('T')[0],
    },
  });

  // Get current user and set default author
  useEffect(() => {
    const userData = sessionStorage.getItem('admin_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      const isAdminUser = user.role === 'admin' || user.username === 'admin';
      setIsAdmin(isAdminUser);
      // Set default author: "Martin Doks Homes" for admin, username for others
      if (isAdminUser) {
        setValue('author', 'Martin Doks Homes');
      } else {
        setValue('author', user.username || 'Martin Doks');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Watch form values for preview
  const formValues = watch();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    if (!document.getElementById('slug')?.getAttribute('data-manual')) {
      setValue('slug', generateSlug(title));
    }
  };

  const onSubmit = async (data: BlogPostFormData, action: 'publish' | 'draft' | 'schedule' = publishAction) => {
    setIsSubmitting(true);
    try {
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      let status: 'published' | 'draft' | 'scheduled' = 'published';
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
      }

      const response = await fetch('/api/admin/blog', {
        method: 'POST',
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
        throw new Error(error.error || 'Failed to create blog post');
      }

      router.push('/admin/blog');
    } catch (error: any) {
      alert(error.message || 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-gray-600">Create a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, publishAction))}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Content</span>
                  <span className="text-xs font-normal text-muted-foreground">(Main information)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Blog Post Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('title')}
                    onChange={handleTitleChange}
                    placeholder="e.g., 5 Tips for Choosing Your Dream Home in Lagos"
                    className={`text-base ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
                    💡 <strong>Tip:</strong> Write a clear, engaging title that tells readers what they'll learn. Keep it under 60 characters for best results.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    URL Slug <span className="text-red-500">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-2">(Auto-generated, you can edit if needed)</span>
                  </label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="5-tips-choosing-dream-home-lagos"
                    className={`text-sm font-mono ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                    onFocus={(e) => e.target.setAttribute('data-manual', 'true')}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    This appears in the web address. Only lowercase letters, numbers, and hyphens are allowed. It's automatically created from your title, but you can customize it.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Short Description (Excerpt) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('excerpt')}
                    rows={4}
                    placeholder="This is a brief summary that appears on the blog listing page. Write 1-2 sentences that capture the main point of your post and encourage readers to click and read more..."
                    className={`w-full px-3 py-2 border rounded-md text-base ${errors.excerpt ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-500 mt-1">{errors.excerpt.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
                    💡 <strong>Tip:</strong> This is what people see before clicking. Make it interesting! Aim for 120-160 characters.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Blog Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('content')}
                    rows={20}
                    placeholder="Write your full blog post here. You can use simple formatting:

• Start a new paragraph by pressing Enter twice
• Use **bold text** by putting two asterisks around it
• Use *italic text* by putting one asterisk around it
• Create lists by starting lines with - or 1.

Example:
This is a paragraph.

**This is bold text**

*This is italic text*

- First item
- Second item"
                    className={`w-full px-3 py-2 border rounded-md text-base leading-relaxed ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2 bg-green-50 p-3 rounded border border-green-200">
                    ✍️ <strong>Writing Tips:</strong>
                    <br />• Write naturally, as if talking to a friend
                    <br />• Break up long paragraphs (3-4 sentences max)
                    <br />• Use headings to organize your content
                    <br />• Add examples and stories to make it engaging
                    <br />• Proofread before publishing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Publishing Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    What would you like to do?
                  </label>
                  <select
                    value={publishAction}
                    onChange={(e) => setPublishAction(e.target.value as 'publish' | 'draft' | 'schedule')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-base"
                  >
                    <option value="publish">📢 Publish Now - Make it live immediately</option>
                    <option value="draft">💾 Save as Draft - Keep it private for now</option>
                    <option value="schedule">⏰ Schedule for Later - Publish at a specific time</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-2">
                    {publishAction === 'publish' && 'Your post will be visible to everyone right away.'}
                    {publishAction === 'draft' && 'Your post will be saved but not visible to visitors. You can edit and publish it later.'}
                    {publishAction === 'schedule' && 'Your post will be automatically published at the date and time you choose below.'}
                  </p>
                </div>

                {publishAction === 'schedule' && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      📅 When should this be published?
                    </label>
                    <Input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full text-base"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      ⏰ Select a date and time in the future. The post will automatically go live at that moment.
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
                    ? (publishAction === 'draft' ? 'Saving...' : publishAction === 'schedule' ? 'Scheduling...' : 'Publishing...')
                    : (publishAction === 'draft' ? 'Save as Draft' : publishAction === 'schedule' ? 'Schedule Post' : 'Publish Post')
                  }
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Additional Information</span>
                  <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('author')}
                    placeholder="Martin Doks Homes"
                    className={`text-base ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={!isAdmin}
                    title={!isAdmin ? 'Only admins can edit the author field' : ''}
                  />
                  {errors.author && (
                    <p className="text-sm text-red-500 mt-1">{errors.author.message}</p>
                  )}
                  {!isAdmin && (
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-200">
                      ℹ️ Author is automatically set to your username. Only administrators can change this.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category
                    <span className="text-xs font-normal text-gray-500 ml-2">(Helps organize your posts)</span>
                  </label>
                  <Input
                    {...register('category')}
                    placeholder="e.g., Company News, Real Estate Tips, Project Updates"
                    className="text-base"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Group similar posts together. Examples: "Company News", "Real Estate Tips", "Project Updates"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tags
                    <span className="text-xs font-normal text-gray-500 ml-2">(Help people find your post)</span>
                  </label>
                  <Input
                    {...register('tags')}
                    placeholder="luxury homes, lagos, real estate, tips"
                    className="text-base"
                  />
                  <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
                    💡 <strong>Tip:</strong> Separate tags with commas. Use keywords people might search for. Example: "luxury homes, lagos, real estate, tips"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Publication Date
                    <span className="text-xs font-normal text-gray-500 ml-2">(When was this written?)</span>
                  </label>
                  <Input
                    type="date"
                    {...register('publishedAt')}
                    className="text-base"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Set the date this post was written. Leave blank to use today's date.
                  </p>
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
                  // Auto-update slug if not manually edited
                  if (!document.getElementById('slug')?.getAttribute('data-manual')) {
                    setValue('slug', generateSlug(updates.title));
                  }
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

