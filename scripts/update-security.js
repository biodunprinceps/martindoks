#!/usr/bin/env node
/**
 * Security Update Script
 * 
 * Updates Next.js, React, and React DOM to latest patched versions
 * Run: node scripts/update-security.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TARGET_VERSIONS = {
  next: '16.0.10',
  react: '19.2.3',
  'react-dom': '19.2.3',
  'eslint-config-next': '16.0.10'
};

console.log('🔒 Security Update Script\n');
console.log('This will update:');
console.log(`  - Next.js: ${TARGET_VERSIONS.next}`);
console.log(`  - React: ${TARGET_VERSIONS.react}`);
console.log(`  - React DOM: ${TARGET_VERSIONS['react-dom']}`);
console.log(`  - eslint-config-next: ${TARGET_VERSIONS['eslint-config-next']}\n`);

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Run this script from the project root.');
  process.exit(1);
}

// Read current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('Current versions:');
console.log(`  - Next.js: ${packageJson.dependencies.next || 'not found'}`);
console.log(`  - React: ${packageJson.dependencies.react || 'not found'}`);
console.log(`  - React DOM: ${packageJson.dependencies['react-dom'] || 'not found'}\n`);

// Confirm update
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you want to proceed with the update? (yes/no): ', (answer) => {
  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('Update cancelled.');
    rl.close();
    process.exit(0);
  }

  rl.close();

  try {
    console.log('\n📦 Installing updates...\n');

    // Update packages
    const packages = Object.entries(TARGET_VERSIONS)
      .map(([pkg, version]) => `${pkg}@${version}`)
      .join(' ');

    execSync(`npm install ${packages}`, { stdio: 'inherit' });

    console.log('\n✅ Security updates installed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Review changes: git diff package.json package-lock.json');
    console.log('  2. Test locally: npm run build && npm start');
    console.log('  3. Run tests: npm test');
    console.log('  4. Commit changes: git add package.json package-lock.json');
    console.log('  5. Deploy to production\n');

  } catch (error) {
    console.error('\n❌ Update failed:', error.message);
    console.error('\nPlease update manually:');
    console.error(`  npm install next@${TARGET_VERSIONS.next} react@${TARGET_VERSIONS.react} react-dom@${TARGET_VERSIONS['react-dom']}`);
    process.exit(1);
  }
});

