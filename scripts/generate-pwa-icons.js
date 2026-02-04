/**
 * PWA Icon Generator Script
 * Generates PWA icons from a source image
 * 
 * Usage: node scripts/generate-pwa-icons.js <source-image-path>
 * Example: node scripts/generate-pwa-icons.js public/images/team/MD3\ black\ logo.png
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available (better image processing)
let sharp;
let hasSharp = false;
try {
  sharp = require('sharp');
  hasSharp = true;
} catch (e) {
  hasSharp = false;
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ICON_SIZES = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-icon.png', size: 180 },
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
];

async function generateIcons(sourceImagePath) {
  if (!fs.existsSync(sourceImagePath)) {
    console.error(`❌ Source image not found: ${sourceImagePath}`);
    process.exit(1);
  }

  if (!hasSharp) {
    console.error('❌ Sharp package not found.');
    console.log('\n📦 To use this script, install sharp:');
    console.log('   npm install sharp --save-dev\n');
    console.log('📋 Alternative: Use online tools:');
    console.log('   1. Visit https://favicon.io or https://realfavicongenerator.net');
    console.log('   2. Upload your logo/image');
    console.log('   3. Download the generated icons');
    console.log('   4. Place them in the public/ folder');
    process.exit(1);
  }

  console.log('🎨 Generating PWA icons...\n');
  console.log(`📸 Source: ${sourceImagePath}\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  for (const icon of ICON_SIZES) {
    const outputPath = path.join(PUBLIC_DIR, icon.name);
    
    try {
      await sharp(sourceImagePath)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated: ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}: ${error.message}`);
    }
  }

  // Generate favicon.ico (requires additional package or manual creation)
  console.log('\n⚠️  Note: favicon.ico needs to be created manually or using an online converter.');
  console.log('   Visit: https://favicon.io/favicon-converter/');
  
  console.log('\n✅ Icon generation complete!');
  console.log('📁 Icons saved to: public/');
}

// Get source image from command line
const sourceImage = process.argv[2];

if (!sourceImage) {
  console.log('📋 PWA Icon Generator\n');
  console.log('Usage: npm run generate:icons <source-image-path>');
  console.log('Example: npm run generate:icons public/images/team/MD3\\ black\\ logo.png\n');
  console.log('💡 Tip: Use a high-resolution logo (at least 512x512px) for best results.');
  console.log('\n📦 Required: npm install sharp --save-dev');
  process.exit(1);
}

if (require.main === module) {
  generateIcons(sourceImage).catch(console.error);
}

