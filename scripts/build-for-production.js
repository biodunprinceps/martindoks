#!/usr/bin/env node

/**
 * Build script for cPanel production deployment
 * This ensures the app is built before cPanel checks it
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Next.js application for production...');

try {
  // Check if .next directory exists
  const nextDir = path.join(process.cwd(), '.next');
  
  // Run the build
  console.log('Running: npm run build');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('✅ Build completed successfully!');
  
  // Verify build output
  if (fs.existsSync(nextDir)) {
    console.log('✅ Build output verified (.next directory exists)');
  } else {
    console.warn('⚠️  Warning: .next directory not found after build');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
