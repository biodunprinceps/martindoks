export type BlogPostStatus = 'draft' | 'published' | 'scheduled';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  featuredImage?: string;
  tags?: string[];
  category?: string;
  status?: BlogPostStatus;
  scheduledPublishAt?: Date;
}

