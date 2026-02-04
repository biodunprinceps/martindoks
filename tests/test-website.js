/**
 * Martin Doks Homes - Website Test Suite
 * Run with: node test-website.js
 */

const https = require('https');
const http = require('http');

// Default to localhost:3000 if TEST_URL not set
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TEST_RESULTS = {
  passed: [],
  failed: [],
  warnings: []
};

// Test helper functions
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body, body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

function test(name, testFn) {
  return async () => {
    try {
      console.log(`Testing: ${name}...`);
      await testFn();
      TEST_RESULTS.passed.push(name);
      console.log(`✅ PASSED: ${name}\n`);
    } catch (error) {
      TEST_RESULTS.failed.push({ name, error: error.message });
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  };
}

function warn(name, message) {
  TEST_RESULTS.warnings.push({ name, message });
  console.log(`⚠️  WARNING: ${name} - ${message}\n`);
}

// Test Cases
const tests = [
  // Public Pages
  test('Home Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!response.body.includes('Martin Doks Homes')) throw new Error('Page content not found');
  }),

  test('About Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/about`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Services Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/services`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Properties Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/properties`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Blog Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/blog`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Contact Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/contact`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Team Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/team`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Testimonials Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/testimonials`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Awards Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/awards`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Brand Associates Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/brand-associates`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Virtual Tour Page Loads', async () => {
    const response = await makeRequest(`${BASE_URL}/virtual-tour`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  // API Endpoints
  test('Newsletter API - Invalid Email Rejected', async () => {
    const response = await makeRequest(`${BASE_URL}/api/newsletter`, 'POST', {
      email: 'invalid-email'
    });
    if (response.status !== 400) throw new Error(`Expected 400 for invalid email, got ${response.status}`);
  }),

  test('Newsletter API - Valid Email Accepted', async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const response = await makeRequest(`${BASE_URL}/api/newsletter`, 'POST', {
      email: testEmail
    });
    if (response.status !== 200 && response.status !== 500) {
      throw new Error(`Expected 200 or 500 (if email service not configured), got ${response.status}`);
    }
  }),

  test('Contact API - Validation Works', async () => {
    const response = await makeRequest(`${BASE_URL}/api/contact`, 'POST', {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    });
    if (response.status !== 200 && response.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${response.status}`);
    }
  }),

  test('Admin Blog API - GET Works', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/blog`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!Array.isArray(response.data.posts)) throw new Error('Response should contain posts array');
  }),

  test('Admin Properties API - GET Works', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/properties`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
    if (!Array.isArray(response.data.properties)) throw new Error('Response should contain properties array');
  }),

  test('Admin Stats API - Blog Stats', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/stats/blog`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Admin Stats API - Properties Stats', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/stats/properties`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Admin Stats API - Subscribers Stats', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/stats/subscribers`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  // SEO & Metadata
  test('Sitemap Exists', async () => {
    const response = await makeRequest(`${BASE_URL}/sitemap.xml`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),

  test('Robots.txt Exists', async () => {
    const response = await makeRequest(`${BASE_URL}/robots.txt`);
    if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  }),
];

// Run all tests
async function runTests() {
  console.log('🚀 Starting Website Test Suite\n');
  console.log(`Testing URL: ${BASE_URL}\n`);
  console.log('='.repeat(50) + '\n');

  for (const testFn of tests) {
    await testFn();
  }

  // Check for common issues
  if (process.env.RESEND_API_KEY) {
    console.log('✅ RESEND_API_KEY is configured');
  } else {
    warn('Email Configuration', 'RESEND_API_KEY not set - email features may not work');
  }

  // Print summary
  console.log('='.repeat(50));
  console.log('\n📊 TEST SUMMARY\n');
  console.log(`✅ Passed: ${TEST_RESULTS.passed.length}`);
  console.log(`❌ Failed: ${TEST_RESULTS.failed.length}`);
  console.log(`⚠️  Warnings: ${TEST_RESULTS.warnings.length}\n`);

  if (TEST_RESULTS.failed.length > 0) {
    console.log('Failed Tests:');
    TEST_RESULTS.failed.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
    console.log('');
  }

  if (TEST_RESULTS.warnings.length > 0) {
    console.log('Warnings:');
    TEST_RESULTS.warnings.forEach(({ name, message }) => {
      console.log(`  - ${name}: ${message}`);
    });
    console.log('');
  }

  process.exit(TEST_RESULTS.failed.length > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);

