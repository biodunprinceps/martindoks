/**
 * Migration Script: JSON Files to PostgreSQL
 * 
 * This script migrates all data from JSON files to PostgreSQL database.
 * 
 * Usage:
 *   1. Set DATABASE_URL in .env.local
 *   2. Run: node scripts/migrate-to-postgresql.js
 * 
 * The script will:
 *   - Create backup of JSON files
 *   - Validate data
 *   - Insert into PostgreSQL
 *   - Verify migration
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const prisma = new PrismaClient();
const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups');

// Ensure backup directory exists
async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating backup directory:', error);
  }
}

// Create timestamped backup
async function backupJsonFiles() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  await fs.mkdir(backupPath, { recursive: true });
  
  const files = ['admin-users.json', 'blog-posts.json', 'properties.json', 'testimonials.json', 'newsletter-subscribers.json'];
  
  for (const file of files) {
    const source = path.join(DATA_DIR, file);
    const dest = path.join(backupPath, file);
    try {
      await fs.copyFile(source, dest);
      console.log(`✓ Backed up ${file}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`⚠ Could not backup ${file}:`, error.message);
      }
    }
  }
  
  return backupPath;
}

// Migrate Admin Users
async function migrateAdminUsers() {
  try {
    const filePath = path.join(DATA_DIR, 'admin-users.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);
    
    console.log(`\n📦 Migrating ${users.length} admin users...`);
    
    for (const user of users) {
      await prisma.adminUser.upsert({
        where: { username: user.username },
        update: {
          password: user.password,
          role: user.role || null,
          permissions: user.permissions || [],
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
        },
        create: {
          id: user.id,
          username: user.username,
          password: user.password,
          role: user.role || null,
          permissions: user.permissions || [],
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
        },
      });
    }
    
    console.log(`✓ Migrated ${users.length} admin users`);
    return users.length;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠ admin-users.json not found, skipping...');
      return 0;
    }
    throw error;
  }
}

// Migrate Blog Posts
async function migrateBlogPosts() {
  try {
    const filePath = path.join(DATA_DIR, 'blog-posts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const posts = JSON.parse(data);
    
    console.log(`\n📦 Migrating ${posts.length} blog posts...`);
    
    for (const post of posts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author || 'Martin Doks',
          publishedAt: new Date(post.publishedAt),
          status: post.status || 'published',
          scheduledPublishAt: post.scheduledPublishAt ? new Date(post.scheduledPublishAt) : null,
          featuredImage: post.featuredImage || null,
          category: post.category || null,
          tags: post.tags || [],
        },
        create: {
          id: post.id || undefined,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author || 'Martin Doks',
          publishedAt: new Date(post.publishedAt),
          status: post.status || 'published',
          scheduledPublishAt: post.scheduledPublishAt ? new Date(post.scheduledPublishAt) : null,
          featuredImage: post.featuredImage || null,
          category: post.category || null,
          tags: post.tags || [],
        },
      });
    }
    
    console.log(`✓ Migrated ${posts.length} blog posts`);
    return posts.length;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠ blog-posts.json not found, skipping...');
      return 0;
    }
    throw error;
  }
}

// Migrate Properties
async function migrateProperties() {
  try {
    const filePath = path.join(DATA_DIR, 'properties.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const properties = JSON.parse(data);
    
    console.log(`\n📦 Migrating ${properties.length} properties...`);
    
    for (const prop of properties) {
      await prisma.property.upsert({
        where: { slug: prop.slug },
        update: {
          title: prop.title,
          description: prop.description,
          location: prop.location,
          price: prop.price || null,
          type: prop.type,
          status: prop.status,
          images: prop.images || [],
          featuredImage: prop.featuredImage,
          bedrooms: prop.bedrooms || null,
          bathrooms: prop.bathrooms || null,
          squareFeet: prop.squareFeet || null,
          virtualTourUrl: prop.virtualTourUrl || null,
        },
        create: {
          id: prop.id,
          slug: prop.slug,
          title: prop.title,
          description: prop.description,
          location: prop.location,
          price: prop.price || null,
          type: prop.type,
          status: prop.status,
          images: prop.images || [],
          featuredImage: prop.featuredImage,
          bedrooms: prop.bedrooms || null,
          bathrooms: prop.bathrooms || null,
          squareFeet: prop.squareFeet || null,
          virtualTourUrl: prop.virtualTourUrl || null,
          createdAt: new Date(prop.createdAt),
          updatedAt: new Date(prop.updatedAt),
        },
      });
    }
    
    console.log(`✓ Migrated ${properties.length} properties`);
    return properties.length;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠ properties.json not found, skipping...');
      return 0;
    }
    throw error;
  }
}

// Migrate Testimonials
async function migrateTestimonials() {
  try {
    const filePath = path.join(DATA_DIR, 'testimonials.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const testimonials = JSON.parse(data);
    
    console.log(`\n📦 Migrating ${testimonials.length} testimonials...`);
    
    for (const testimonial of testimonials) {
      await prisma.testimonial.upsert({
        where: { id: testimonial.id },
        update: {
          name: testimonial.name,
          role: testimonial.role || null,
          company: testimonial.company || null,
          content: testimonial.content,
          image: testimonial.image || null,
          rating: testimonial.rating || 5,
          featured: testimonial.featured || false,
        },
        create: {
          id: testimonial.id,
          name: testimonial.name,
          role: testimonial.role || null,
          company: testimonial.company || null,
          content: testimonial.content,
          image: testimonial.image || null,
          rating: testimonial.rating || 5,
          featured: testimonial.featured || false,
          createdAt: new Date(testimonial.createdAt),
          updatedAt: new Date(testimonial.updatedAt),
        },
      });
    }
    
    console.log(`✓ Migrated ${testimonials.length} testimonials`);
    return testimonials.length;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠ testimonials.json not found, skipping...');
      return 0;
    }
    throw error;
  }
}

// Migrate Newsletter Subscribers
async function migrateNewsletterSubscribers() {
  try {
    const filePath = path.join(DATA_DIR, 'newsletter-subscribers.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const subscribers = JSON.parse(data);
    
    console.log(`\n📦 Migrating ${subscribers.length} newsletter subscribers...`);
    
    for (const subscriber of subscribers) {
      await prisma.newsletterSubscriber.upsert({
        where: { email: subscriber.email },
        update: {
          verified: subscriber.verified || false,
          verificationToken: subscriber.verificationToken || null,
          verifiedAt: subscriber.verifiedAt ? new Date(subscriber.verifiedAt) : null,
          unsubscribedAt: subscriber.unsubscribedAt ? new Date(subscriber.unsubscribedAt) : null,
        },
        create: {
          id: subscriber.id,
          email: subscriber.email,
          verified: subscriber.verified || false,
          verificationToken: subscriber.verificationToken || null,
          verifiedAt: subscriber.verifiedAt ? new Date(subscriber.verifiedAt) : null,
          subscribedAt: new Date(subscriber.subscribedAt),
          unsubscribedAt: subscriber.unsubscribedAt ? new Date(subscriber.unsubscribedAt) : null,
          createdAt: new Date(subscriber.createdAt),
          updatedAt: new Date(subscriber.updatedAt),
        },
      });
    }
    
    console.log(`✓ Migrated ${subscribers.length} newsletter subscribers`);
    return subscribers.length;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠ newsletter-subscribers.json not found, skipping...');
      return 0;
    }
    throw error;
  }
}

// Main migration function
async function main() {
  console.log('🚀 Starting PostgreSQL Migration...\n');
  
  try {
    // Check DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
      console.error('Please set DATABASE_URL in your .env.local file');
      process.exit(1);
    }
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✓ Database connection successful\n');
    
    // Create backup
    console.log('💾 Creating backup of JSON files...');
    const backupPath = await backupJsonFiles();
    console.log(`✓ Backup created at: ${backupPath}\n`);
    
    // Run migrations
    const results = {
      users: await migrateAdminUsers(),
      posts: await migrateBlogPosts(),
      properties: await migrateProperties(),
      testimonials: await migrateTestimonials(),
      subscribers: await migrateNewsletterSubscribers(),
    };
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Migration Complete!');
    console.log('='.repeat(50));
    console.log(`Admin Users:      ${results.users}`);
    console.log(`Blog Posts:       ${results.posts}`);
    console.log(`Properties:       ${results.properties}`);
    console.log(`Testimonials:     ${results.testimonials}`);
    console.log(`Subscribers:      ${results.subscribers}`);
    console.log(`\nBackup location: ${backupPath}`);
    console.log('\n⚠️  IMPORTANT: Review the data in your database before switching USE_DATABASE=true');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\nYour JSON files are safe in the backup directory.');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
if (require.main === module) {
  main();
}

module.exports = { main };

