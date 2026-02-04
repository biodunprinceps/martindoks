/**
 * Test script for Testimonials Admin Portal
 * Run: node test-testimonials.js
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, url, body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${url}`, options);
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function runTests() {
  log('\n🧪 Testing Testimonials Admin Portal\n', 'blue');
  
  let passed = 0;
  let failed = 0;

  // Test 1: Get all testimonials
  log('Test 1: GET /api/admin/testimonials', 'yellow');
  const test1 = await testEndpoint('GET', '/api/admin/testimonials');
  if (test1.ok && Array.isArray(test1.data.testimonials)) {
    log('✅ PASS: Testimonials API returns array', 'green');
    passed++;
  } else {
    log(`❌ FAIL: ${test1.error || test1.data?.error || 'Unexpected response'}`, 'red');
    failed++;
  }

  // Test 2: Create testimonial
  log('\nTest 2: POST /api/admin/testimonials', 'yellow');
  const newTestimonial = {
    name: 'Test Client',
    role: 'Homeowner',
    company: 'Test Company',
    content: 'This is a test testimonial to verify the admin portal functionality.',
    rating: 5,
  };
  const test2 = await testEndpoint('POST', '/api/admin/testimonials', newTestimonial);
  if (test2.ok && test2.data.testimonial) {
    log('✅ PASS: Testimonial created successfully', 'green');
    const testimonialId = test2.data.testimonial.id;
    passed++;

    // Test 3: Get single testimonial
    log('\nTest 3: GET /api/admin/testimonials/[id]', 'yellow');
    const test3 = await testEndpoint('GET', `/api/admin/testimonials/${testimonialId}`);
    if (test3.ok && test3.data.testimonial) {
      log('✅ PASS: Single testimonial retrieved', 'green');
      passed++;
    } else {
      log(`❌ FAIL: ${test3.error || test3.data?.error}`, 'red');
      failed++;
    }

    // Test 4: Update testimonial
    log('\nTest 4: PUT /api/admin/testimonials/[id]', 'yellow');
    const updateData = {
      ...newTestimonial,
      content: 'Updated testimonial content for testing purposes.',
      rating: 4,
    };
    const test4 = await testEndpoint('PUT', `/api/admin/testimonials/${testimonialId}`, updateData);
    if (test4.ok && test4.data.testimonial) {
      log('✅ PASS: Testimonial updated successfully', 'green');
      passed++;
    } else {
      log(`❌ FAIL: ${test4.error || test4.data?.error}`, 'red');
      failed++;
    }

    // Test 5: Delete testimonial
    log('\nTest 5: DELETE /api/admin/testimonials/[id]', 'yellow');
    const test5 = await testEndpoint('DELETE', `/api/admin/testimonials/${testimonialId}`);
    if (test5.ok) {
      log('✅ PASS: Testimonial deleted successfully', 'green');
      passed++;
    } else {
      log(`❌ FAIL: ${test5.error || test5.data?.error}`, 'red');
      failed++;
    }
  } else {
    log(`❌ FAIL: ${test2.error || test2.data?.error || 'Failed to create testimonial'}`, 'red');
    failed++;
  }

  // Test 6: Validation
  log('\nTest 6: Validation (missing required fields)', 'yellow');
  const invalidTestimonial = {
    name: '', // Missing required field
    content: 'Short', // Too short
  };
  const test6 = await testEndpoint('POST', '/api/admin/testimonials', invalidTestimonial);
  if (!test6.ok && test6.status === 400) {
    log('✅ PASS: Validation working correctly', 'green');
    passed++;
  } else {
    log('❌ FAIL: Validation should reject invalid data', 'red');
    failed++;
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log(`\n📊 Test Results: ${passed} passed, ${failed} failed`, failed > 0 ? 'red' : 'green');
  log('='.repeat(50) + '\n', 'blue');

  if (failed === 0) {
    log('🎉 All tests passed! Testimonials admin portal is working correctly.', 'green');
  } else {
    log('⚠️  Some tests failed. Please check the errors above.', 'yellow');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  log('❌ Error: fetch is not available. Please use Node.js 18+ or install node-fetch', 'red');
  process.exit(1);
}

runTests().catch(console.error);

