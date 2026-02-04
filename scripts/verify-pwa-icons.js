/**
 * PWA Icon Verification Script
 * Verifies that all required PWA icons exist and have correct dimensions
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const REQUIRED_ICONS = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-icon.png', size: 180 },
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
];

function verifyIconBasic(fileName, expectedSize) {
  const filePath = path.join(PUBLIC_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing: ${fileName}`);
    return false;
  }

  // Get file stats
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  
  // Basic validation - file exists and has content
  if (fileSize === 0) {
    console.error(`❌ ${fileName}: File is empty`);
    return false;
  }

  console.log(`✅ ${fileName}: Found (${(fileSize / 1024).toFixed(2)} KB)`);
  console.log(`   Expected size: ${expectedSize}x${expectedSize}px`);
  console.log(`   ⚠️  Note: To verify exact dimensions, install 'canvas' package:`);
  console.log(`   npm install canvas --save-dev\n`);
  return true;
}

async function verifyIconWithCanvas(fileName, expectedSize) {
  const filePath = path.join(PUBLIC_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing: ${fileName}`);
    return false;
  }

  try {
    const { loadImage } = require('canvas');
    const image = await loadImage(filePath);
    if (image.width !== expectedSize || image.height !== expectedSize) {
      console.warn(`⚠️  ${fileName}: Expected ${expectedSize}x${expectedSize}, got ${image.width}x${image.height}`);
      return false;
    }
    console.log(`✅ ${fileName}: ${image.width}x${image.height} (correct)`);
    return true;
  } catch (error) {
    console.error(`❌ ${fileName}: Error reading image - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Verifying PWA Icons...\n');
  
  // Check if canvas is available for dimension verification
  let hasCanvas = false;
  try {
    require.resolve('canvas');
    hasCanvas = true;
  } catch (e) {
    // Canvas not available, use basic verification
  }

  let allValid = true;
  for (const icon of REQUIRED_ICONS) {
    if (hasCanvas) {
      const isValid = await verifyIconWithCanvas(icon.name, icon.size);
      if (!isValid) allValid = false;
    } else {
      const isValid = verifyIconBasic(icon.name, icon.size);
      if (!isValid) allValid = false;
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allValid) {
    console.log('✅ All PWA icons are present!');
    if (!hasCanvas) {
      console.log('\n💡 For exact dimension verification, install canvas:');
      console.log('   npm install canvas --save-dev');
    }
  } else {
    console.log('⚠️  Some icons need attention. See above for details.');
    console.log('\n💡 Tip: Use an online tool like favicon.io to generate all required sizes from a single image.');
  }
}

// Run main function
if (require.main === module) {
  main().catch(console.error);
}

