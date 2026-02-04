#!/usr/bin/env node

/**
 * COMPREHENSIVE DEBUG SCRIPT FOR CPANEL
 *
 * This script tests all admin API endpoints to identify what's failing
 * Run this LOCALLY first to verify it works, then run on cPanel
 */

const BASE_URL = process.env.SITE_URL || "https://martindokshomes.com";

console.log("=".repeat(60));
console.log("MARTIN DOKS HOMES - ADMIN API DEBUG SCRIPT");
console.log("=".repeat(60));
console.log(`Testing against: ${BASE_URL}`);
console.log(`Time: ${new Date().toISOString()}`);
console.log("=".repeat(60));
console.log("");

async function testEndpoint(method, path, body = null) {
  console.log(`\n📍 Testing: ${method} ${path}`);
  console.log("-".repeat(60));

  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
      console.log("Request Body:", JSON.stringify(body, null, 2));
    }

    const url = `${BASE_URL}${path}`;
    console.log(`Full URL: ${url}`);

    const startTime = Date.now();
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    console.log(`⏱️  Response Time: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📝 Content-Type: ${response.headers.get("content-type")}`);

    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      console.log("✅ JSON Response:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log(
        "⚠️  Non-JSON Response (first 200 chars):",
        text.substring(0, 200)
      );
      data = text;
    }

    if (response.ok) {
      console.log("✅ SUCCESS");
    } else {
      console.log("❌ FAILED");
    }

    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.log("💥 ERROR:", error.message);
    console.log("Stack:", error.stack);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  const results = [];

  // Test 1: Health Check
  console.log("\n" + "=".repeat(60));
  console.log("TEST 1: Health Check");
  console.log("=".repeat(60));
  results.push(await testEndpoint("GET", "/api/health"));

  // Test 2: Debug Data Endpoint
  console.log("\n" + "=".repeat(60));
  console.log("TEST 2: Debug Data (File Status)");
  console.log("=".repeat(60));
  results.push(await testEndpoint("GET", "/api/debug/data"));

  // Test 3: Get All Blog Posts
  console.log("\n" + "=".repeat(60));
  console.log("TEST 3: Get All Blog Posts");
  console.log("=".repeat(60));
  const blogListResult = await testEndpoint("GET", "/api/admin/blog");
  results.push(blogListResult);

  // Get first blog slug for further tests
  let firstBlogSlug = null;
  if (
    blogListResult.success &&
    blogListResult.data &&
    blogListResult.data.posts
  ) {
    const posts = blogListResult.data.posts;
    if (posts.length > 0) {
      firstBlogSlug = posts[0].slug;
      console.log(`\n📌 Found blog post for testing: "${firstBlogSlug}"`);
    }
  }

  // Test 4: Get Single Blog Post
  if (firstBlogSlug) {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 4: Get Single Blog Post");
    console.log("=".repeat(60));
    results.push(await testEndpoint("GET", `/api/admin/blog/${firstBlogSlug}`));
  } else {
    console.log("\n⚠️  Skipping Test 4: No blog posts found");
  }

  // Test 5: Update Blog Post (dry run - won't actually change anything critical)
  if (firstBlogSlug) {
    console.log("\n" + "=".repeat(60));
    console.log("TEST 5: Update Blog Post (Tags Only - Safe Test)");
    console.log("=".repeat(60));
    results.push(
      await testEndpoint("PUT", `/api/admin/blog/${firstBlogSlug}`, {
        tags: ["test-debug-script"],
      })
    );
  }

  // Test 6: Get All Properties
  console.log("\n" + "=".repeat(60));
  console.log("TEST 6: Get All Properties");
  console.log("=".repeat(60));
  const propertiesResult = await testEndpoint("GET", "/api/admin/properties");
  results.push(propertiesResult);

  // Test 7: Get All Testimonials
  console.log("\n" + "=".repeat(60));
  console.log("TEST 7: Get All Testimonials");
  console.log("=".repeat(60));
  results.push(await testEndpoint("GET", "/api/admin/testimonials"));

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}`);

  if (failed === 0) {
    console.log("\n🎉 ALL TESTS PASSED! APIs are working correctly.");
  } else {
    console.log("\n⚠️  SOME TESTS FAILED. Check the details above.");
  }

  console.log("\n" + "=".repeat(60));
  console.log("DEBUG COMPLETE");
  console.log("=".repeat(60));
}

// Run tests
runTests().catch((error) => {
  console.error("\n💥 Fatal Error:", error);
  process.exit(1);
});
