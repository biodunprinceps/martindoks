# Test Files

This folder contains all test files and test reports for the Martin Doks Homes project.

## Test Scripts

### `test-website.js`
Main website test suite that checks:
- All public pages load correctly
- API endpoints work properly
- SEO files (sitemap, robots.txt) exist
- Newsletter and contact forms validate correctly

**Usage:**
```bash
# Test local server (default)
node test-website.js

# Test production
TEST_URL=https://martindokshomes.com node test-website.js
```

### `test-testimonials.js`
Test suite specifically for the testimonials admin portal:
- GET all testimonials
- CREATE new testimonial
- GET single testimonial
- UPDATE testimonial
- DELETE testimonial
- Validation checks

**Usage:**
```bash
node test-testimonials.js
```

### `test-whatsapp.html`
HTML test page for verifying WhatsApp integration:
- Tests WhatsApp button links
- Verifies phone number format
- Tests pre-filled messages
- Provides verification checklist

**Usage:**
Open in a web browser to test WhatsApp links.

## Test Runner Scripts

### Windows Batch Files
- `test-local.bat` - Run tests against local server (http://localhost:3000)
- `test-production.bat` - Run tests against production (https://martindokshomes.com)

### PowerShell Scripts
- `test-local.ps1` - Run tests against local server
- `test-production.ps1` - Run tests against production

**Usage:**
Double-click the batch/PowerShell files or run from command line.

## Test Reports

- `chromewebdata_2025-12-04_16-50-52.report.html` - Lighthouse/performance report
- `localhost_2025-12-04_16-54-53.report.html` - Localhost test report

## Running Tests from Root Directory

You can also run tests from the project root using npm scripts:

```bash
npm test              # Run main test suite
npm run test:local    # Run tests against local server
npm run test:testimonials  # Run testimonials tests
```

These commands are configured in `package.json` and will automatically use the correct paths.

