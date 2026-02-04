#!/usr/bin/env node

/**
 * Node.js Server Health Check Script
 * Run this on cPanel to diagnose server issues
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

console.log("=".repeat(60));
console.log("Node.js Server Health Check");
console.log("=".repeat(60));
console.log();

// Check 1: Environment
console.log("1. Environment Check:");
console.log(
  `   NODE_ENV: ${
    process.env.NODE_ENV || "not set (will default to development)"
  }`
);
console.log(`   PORT: ${process.env.PORT || "3000 (default)"}`);
console.log(`   Node Version: ${process.version}`);
console.log();

// Check 2: Required files
console.log("2. File Structure Check:");
const requiredFiles = [
  "server.js",
  ".next/BUILD_ID",
  ".next/package.json",
  "package.json",
  "node_modules/next",
];

requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${exists ? "✓" : "✗"} ${file}`);
});
console.log();

// Check 3: Test server connection
console.log("3. Server Connection Test:");
const port = process.env.PORT || 3000;

const options = {
  hostname: "127.0.0.1",
  port: port,
  path: "/api/health",
  method: "GET",
  timeout: 5000,
};

const req = http.request(options, (res) => {
  console.log(`   ✓ Server is responding on port ${port}`);
  console.log(`   Status Code: ${res.statusCode}`);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(`   Response: ${data}`);
    console.log();
    console.log("=".repeat(60));
    console.log("✓ Node.js server is RUNNING and healthy!");
    console.log("=".repeat(60));
  });
});

req.on("error", (error) => {
  console.log(`   ✗ Cannot connect to server on port ${port}`);
  console.log(`   Error: ${error.message}`);
  console.log();
  console.log("=".repeat(60));
  console.log("✗ Node.js server is NOT running!");
  console.log("=".repeat(60));
  console.log();
  console.log("ACTION REQUIRED:");
  console.log("1. Go to cPanel → Setup Node.js App");
  console.log('2. Click "Run NPM Install" button');
  console.log("3. Set Environment Variables:");
  console.log("   - NODE_ENV=production");
  console.log("   - PORT=3000");
  console.log('4. Click "Start" or "Restart"');
  console.log('5. Verify status shows "Running" (green)');
  console.log();
});

req.on("timeout", () => {
  req.destroy();
  console.log(`   ✗ Server connection timed out after 5 seconds`);
  console.log();
  console.log("=".repeat(60));
  console.log("✗ Node.js server is NOT responding!");
  console.log("=".repeat(60));
});

req.end();
