/**
 * Check if the development server is running
 */

const http = require('http');

function checkServer(url, timeout = 5000) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 3000,
      path: '/',
      method: 'HEAD',
      timeout: timeout,
    };

    const req = http.request(options, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  const url = process.argv[2] || 'http://localhost:3000';
  const isRunning = await checkServer(url);

  if (!isRunning) {
    console.error(`❌ Server is not running at ${url}`);
    console.log('\n💡 Please start your development server first:');
    console.log('   npm run dev');
    process.exit(1);
  } else {
    console.log(`✅ Server is running at ${url}`);
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkServer };

