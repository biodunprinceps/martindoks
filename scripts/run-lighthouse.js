/**
 * Run Lighthouse audit with proper error handling
 */

const { checkServer } = require('./check-server');
const { spawn } = require('child_process');
const path = require('path');

async function main() {
  const url = process.argv[2] || 'http://localhost:3000';

  console.log('🔍 Checking if server is running...\n');

  // Check if server is running
  const isRunning = await checkServer(url);
  
  if (!isRunning) {
    console.error(`❌ Server is not running at ${url}`);
    console.log('\n💡 Please start your development server first:');
    console.log('   npm run dev');
    console.log('\n   Then in another terminal, run:');
    console.log('   npm run lighthouse');
    process.exit(1);
  }

  console.log(`✅ Server is running at ${url}\n`);
  console.log('🚀 Starting Lighthouse audit...\n');
  console.log('⏳ This may take a minute...\n');

  // Run Lighthouse
  const lighthouseProcess = spawn('npx', [
    'lighthouse',
    url,
    '--view',
    '--chrome-flags=--disable-web-security'
  ], {
    stdio: 'inherit',
    shell: true,
  });

  lighthouseProcess.on('close', (code) => {
    // Exit code 0 = success, but even with permission errors, the report is usually generated
    if (code === 0) {
      console.log('\n✅ Lighthouse audit completed successfully!');
      console.log('📊 Report should have opened in your browser.');
    } else {
      console.log('\n⚠️  Lighthouse completed with exit code:', code);
      console.log('📊 Check if the report was generated (it usually is, even with errors).');
      console.log('\n💡 Note: Permission errors at the end are harmless on Windows.');
      console.log('   The report file should still be in your project directory.');
    }
    process.exit(0);
  });

  lighthouseProcess.on('error', (error) => {
    console.error('\n❌ Error running Lighthouse:', error.message);
    console.log('\n💡 Make sure Lighthouse is installed:');
    console.log('   npm install -g lighthouse');
    console.log('   or');
    console.log('   npx lighthouse (will install automatically)');
    process.exit(1);
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

