#!/usr/bin/env node

/**
 * cPanel Deployment Verification Script
 * Run this after deployment to verify everything is set up correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying cPanel deployment setup...\n');

let errors = [];
let warnings = [];
let success = [];

// Check Node version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  console.log(`✓ Node.js version: ${nodeVersion}`);
  
  if (majorVersion < 18) {
    errors.push(`Node.js version ${nodeVersion} is too old. Requires 18+`);
  } else if (majorVersion >= 22) {
    warnings.push(`Node.js ${nodeVersion} is very new. Ensure cPanel supports it.`);
  } else {
    success.push(`Node.js version ${nodeVersion} is compatible`);
  }
} catch (err) {
  errors.push(`Could not check Node.js version: ${err.message}`);
}

// Check if .next directory exists (build completed)
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('✓ Build directory (.next) exists');
  success.push('Application has been built');
  
  // Check if build output is valid
  const buildManifest = path.join(nextDir, 'BUILD_ID');
  if (fs.existsSync(buildManifest)) {
    const buildId = fs.readFileSync(buildManifest, 'utf8').trim();
    console.log(`✓ Build ID: ${buildId}`);
    success.push('Build output is valid');
  } else {
    warnings.push('Build directory exists but BUILD_ID not found - build may be incomplete');
  }
} else {
  errors.push('Build directory (.next) not found - run "npm run build" first');
  console.log('✗ Build directory (.next) not found');
}

// Check required directories
const requiredDirs = [
  'public',
  'public/uploads',
  'public/images',
  'data'
];

console.log('\n📁 Checking required directories:');
requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✓ ${dir}`);
    success.push(`Directory ${dir} exists`);
    
    // Check if writable
    try {
      fs.accessSync(dirPath, fs.constants.W_OK);
      success.push(`Directory ${dir} is writable`);
    } catch (err) {
      warnings.push(`Directory ${dir} exists but may not be writable`);
    }
  } else {
    console.log(`  ✗ ${dir} - MISSING`);
    errors.push(`Required directory missing: ${dir}`);
  }
});

// Check environment variables
console.log('\n🔐 Checking environment variables:');
const requiredEnvVars = ['NODE_ENV'];
const optionalEnvVars = ['DATABASE_URL', 'RESEND_API_KEY', 'PORT'];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✓ ${envVar}=${process.env[envVar]}`);
    success.push(`Environment variable ${envVar} is set`);
  } else {
    console.log(`  ✗ ${envVar} - NOT SET`);
    errors.push(`Required environment variable missing: ${envVar}`);
  }
});

optionalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✓ ${envVar} is set`);
    success.push(`Environment variable ${envVar} is configured`);
  } else {
    console.log(`  ⚠ ${envVar} - not set (optional)`);
    warnings.push(`Optional environment variable not set: ${envVar}`);
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'start'];

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`  ✓ npm run ${script} available`);
    success.push(`Script ${script} is available`);
  } else {
    console.log(`  ✗ npm run ${script} - MISSING`);
    errors.push(`Required script missing: ${script}`);
  }
});

// Check if server.js exists
if (fs.existsSync('server.js')) {
  console.log('✓ server.js exists');
  success.push('Custom server file exists');
} else {
  warnings.push('server.js not found - using default Next.js server');
}

// Check .htaccess
if (fs.existsSync('.htaccess')) {
  console.log('✓ .htaccess exists');
  success.push('Apache configuration file exists');
} else {
  warnings.push('.htaccess not found - may need for cPanel routing');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));

if (success.length > 0) {
  console.log(`\n✅ Success (${success.length}):`);
  success.forEach(msg => console.log(`   • ${msg}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Warnings (${warnings.length}):`);
  warnings.forEach(msg => console.log(`   • ${msg}`));
}

if (errors.length > 0) {
  console.log(`\n❌ Errors (${errors.length}):`);
  errors.forEach(msg => console.log(`   • ${msg}`));
  console.log('\n⚠️  Please fix errors before deploying to production!');
  process.exit(1);
} else {
  console.log('\n✅ All critical checks passed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Ensure NODE_ENV=production is set in cPanel');
  console.log('   2. Run: npm run build');
  console.log('   3. Start the application in cPanel');
  console.log('   4. Test: https://demo.martindokshomes.com/api/health');
  process.exit(0);
}
