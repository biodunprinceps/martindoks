#!/usr/bin/env node

/**
 * Test Build Script
 * Verifies that the build process works correctly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing build process...\n');

try {
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    console.log('⚠️  node_modules not found. Running npm install first...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Set production environment
  process.env.NODE_ENV = 'production';

  console.log('🔨 Running build...');
  console.log('Command: npm run build\n');
  
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Verify build output
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    console.log('\n✅ Build completed successfully!');
    console.log(`✓ Build output directory exists: ${nextDir}`);
    
    // Check for key build files
    const buildId = path.join(nextDir, 'BUILD_ID');
    if (fs.existsSync(buildId)) {
      const id = fs.readFileSync(buildId, 'utf8').trim();
      console.log(`✓ Build ID: ${id}`);
    }
    
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      console.log('✓ Static assets generated');
    }
    
    console.log('\n✅ Build test passed!');
    console.log('\n📝 Next steps for cPanel:');
    console.log('   1. Upload all files (except node_modules and .next)');
    console.log('   2. In cPanel, run: npm install');
    console.log('   3. In cPanel, run: npm run build');
    console.log('   4. Start the application');
    
  } else {
    console.error('\n❌ Build failed: .next directory not found');
    process.exit(1);
  }
  
} catch (error) {
  console.error('\n❌ Build test failed:', error.message);
  console.error('\nTroubleshooting:');
  console.error('   1. Check Node.js version (requires 18+)');
  console.error('   2. Run: npm install');
  console.error('   3. Check for TypeScript errors');
  console.error('   4. Verify all dependencies are installed');
  process.exit(1);
}
