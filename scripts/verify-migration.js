/**
 * Verification Script: Compare JSON Files with PostgreSQL
 * 
 * This script verifies that the migration was successful by comparing
 * JSON file data with the database.
 * 
 * Usage: node scripts/verify-migration.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();
const DATA_DIR = path.join(process.cwd(), 'data');

async function verifyAdminUsers() {
  try {
    const filePath = path.join(DATA_DIR, 'admin-users.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonUsers = JSON.parse(data);
    const dbUsers = await prisma.adminUser.findMany();
    
    console.log(`\n👥 Admin Users:`);
    console.log(`  JSON: ${jsonUsers.length}, Database: ${dbUsers.length}`);
    
    if (jsonUsers.length !== dbUsers.length) {
      console.log(`  ⚠️  Count mismatch!`);
      return false;
    }
    
    for (const jsonUser of jsonUsers) {
      const dbUser = dbUsers.find(u => u.username === jsonUser.username);
      if (!dbUser) {
        console.log(`  ❌ Missing user: ${jsonUser.username}`);
        return false;
      }
    }
    
    console.log(`  ✅ All users migrated correctly`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`  ⚠️  admin-users.json not found, skipping...`);
      return true;
    }
    throw error;
  }
}

async function verifyBlogPosts() {
  try {
    const filePath = path.join(DATA_DIR, 'blog-posts.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonPosts = JSON.parse(data);
    const dbPosts = await prisma.blogPost.findMany();
    
    console.log(`\n📝 Blog Posts:`);
    console.log(`  JSON: ${jsonPosts.length}, Database: ${dbPosts.length}`);
    
    if (jsonPosts.length !== dbPosts.length) {
      console.log(`  ⚠️  Count mismatch!`);
      return false;
    }
    
    for (const jsonPost of jsonPosts) {
      const dbPost = dbPosts.find(p => p.slug === jsonPost.slug);
      if (!dbPost) {
        console.log(`  ❌ Missing post: ${jsonPost.slug}`);
        return false;
      }
      if (dbPost.title !== jsonPost.title) {
        console.log(`  ⚠️  Title mismatch for: ${jsonPost.slug}`);
        return false;
      }
    }
    
    console.log(`  ✅ All posts migrated correctly`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`  ⚠️  blog-posts.json not found, skipping...`);
      return true;
    }
    throw error;
  }
}

async function verifyProperties() {
  try {
    const filePath = path.join(DATA_DIR, 'properties.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonProperties = JSON.parse(data);
    const dbProperties = await prisma.property.findMany();
    
    console.log(`\n🏠 Properties:`);
    console.log(`  JSON: ${jsonProperties.length}, Database: ${dbProperties.length}`);
    
    if (jsonProperties.length !== dbProperties.length) {
      console.log(`  ⚠️  Count mismatch!`);
      return false;
    }
    
    for (const jsonProp of jsonProperties) {
      const dbProp = dbProperties.find(p => p.slug === jsonProp.slug);
      if (!dbProp) {
        console.log(`  ❌ Missing property: ${jsonProp.slug}`);
        return false;
      }
      if (dbProp.title !== jsonProp.title) {
        console.log(`  ⚠️  Title mismatch for: ${jsonProp.slug}`);
        return false;
      }
    }
    
    console.log(`  ✅ All properties migrated correctly`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`  ⚠️  properties.json not found, skipping...`);
      return true;
    }
    throw error;
  }
}

async function verifyTestimonials() {
  try {
    const filePath = path.join(DATA_DIR, 'testimonials.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonTestimonials = JSON.parse(data);
    const dbTestimonials = await prisma.testimonial.findMany();
    
    console.log(`\n💬 Testimonials:`);
    console.log(`  JSON: ${jsonTestimonials.length}, Database: ${dbTestimonials.length}`);
    
    if (jsonTestimonials.length !== dbTestimonials.length) {
      console.log(`  ⚠️  Count mismatch!`);
      return false;
    }
    
    for (const jsonTestimonial of jsonTestimonials) {
      const dbTestimonial = dbTestimonials.find(t => t.id === jsonTestimonial.id);
      if (!dbTestimonial) {
        console.log(`  ❌ Missing testimonial: ${jsonTestimonial.id}`);
        return false;
      }
    }
    
    console.log(`  ✅ All testimonials migrated correctly`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`  ⚠️  testimonials.json not found, skipping...`);
      return true;
    }
    throw error;
  }
}

async function verifySubscribers() {
  try {
    const filePath = path.join(DATA_DIR, 'newsletter-subscribers.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonSubscribers = JSON.parse(data);
    const dbSubscribers = await prisma.newsletterSubscriber.findMany();
    
    console.log(`\n📧 Newsletter Subscribers:`);
    console.log(`  JSON: ${jsonSubscribers.length}, Database: ${dbSubscribers.length}`);
    
    if (jsonSubscribers.length !== dbSubscribers.length) {
      console.log(`  ⚠️  Count mismatch!`);
      return false;
    }
    
    for (const jsonSub of jsonSubscribers) {
      const dbSub = dbSubscribers.find(s => s.email === jsonSub.email);
      if (!dbSub) {
        console.log(`  ❌ Missing subscriber: ${jsonSub.email}`);
        return false;
      }
    }
    
    console.log(`  ✅ All subscribers migrated correctly`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`  ⚠️  newsletter-subscribers.json not found, skipping...`);
      return true;
    }
    throw error;
  }
}

async function main() {
  console.log('🔍 Verifying Migration...\n');
  
  try {
    await prisma.$connect();
    
    const results = {
      users: await verifyAdminUsers(),
      posts: await verifyBlogPosts(),
      properties: await verifyProperties(),
      testimonials: await verifyTestimonials(),
      subscribers: await verifySubscribers(),
    };
    
    const allPassed = Object.values(results).every(r => r === true);
    
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log('✅ All verifications passed!');
    } else {
      console.log('⚠️  Some verifications failed. Please review the output above.');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };

