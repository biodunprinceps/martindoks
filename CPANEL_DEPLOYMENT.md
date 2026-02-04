# cPanel Deployment Guide for Martin Doks Homes

## Important: Deployment Order

cPanel checks your application immediately after `npm install`, but Next.js requires a build step. Follow these steps **in order**:

## Step-by-Step cPanel Deployment

### 1. Upload Files
Upload all project files to your cPanel directory (usually `public_html` or a subdomain directory).

### 2. Set Environment Variables in cPanel
In cPanel Node.js App settings, set:
- `NODE_ENV=production`
- `PORT=3000` (or your assigned port)
- Any other environment variables (DATABASE_URL, RESEND_API_KEY, etc.)

### 3. Install Dependencies
In cPanel Node.js App interface:
- Click "Run NPM Install"
- Wait for completion (may take 5-10 minutes)

**Note:** You may see a content-type error after install - this is normal. Continue to step 4.

### 4. Build the Application
**CRITICAL:** After `npm install`, you MUST build the app before starting:

In cPanel Terminal or SSH:
```bash
cd /path/to/your/app
npm run build
```

Or in cPanel Node.js App:
- Use "Run NPM Script" → select "build"
- Or use Terminal to run: `npm run build`

### 5. Start the Application
In cPanel Node.js App:
- Click "Start App"
- The app should now be running

### 6. Verify Deployment
- Visit your domain: `https://demo.martindokshomes.com`
- Check health endpoint: `https://demo.martindokshomes.com/api/health`
- Should return: `{"status":"ok","timestamp":"...","environment":"production"}`

## Troubleshooting

### Error: "Content type before operation doesn't equal content type after operation"

**Cause:** cPanel checks the app immediately after `npm install`, but Next.js isn't built yet.

**Solution:**
1. Ignore this error initially
2. Run `npm run build` manually (Step 4 above)
3. Then start the app

### Error: "Application failed to start"

**Check:**
1. Is `NODE_ENV=production` set in cPanel?
2. Did you run `npm run build`?
3. Check cPanel error logs
4. Verify port number matches `.htaccess` (usually 3000)

### Build Fails

**Common causes:**
- Node version mismatch (requires Node 18+)
- Missing dependencies
- Memory limit (cPanel may limit to 512MB)

**Solutions:**
- Check Node version in cPanel (should be 18+)
- Try: `npm install --legacy-peer-deps`
- Contact hosting provider to increase memory limit

### App Runs But Shows Errors

1. **Check file permissions:**
   ```bash
   chmod -R 755 public
   chmod -R 755 .next
   ```

2. **Verify environment variables are set**

3. **Check server logs in cPanel**

## File Structure Requirements

Ensure these directories exist and are writable:
```
your-app/
├── .next/          (created after build)
├── public/
│   ├── uploads/    (must exist, writable)
│   └── images/     (must exist)
├── data/           (must exist, writable - for JSON storage)
└── node_modules/   (created after npm install)
```

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start server
npm start

# Check if app is running
curl http://localhost:3000/api/health
```

## Post-Deployment Checklist

- [ ] App starts without errors
- [ ] Homepage loads correctly
- [ ] Admin portal accessible at `/admin`
- [ ] API endpoints work (`/api/health`, `/api/newsletter`)
- [ ] Image uploads work
- [ ] Forms submit correctly
- [ ] SSL/HTTPS enabled
- [ ] Environment variables configured

## Verification After Deployment

After completing all steps, verify your deployment:

```bash
# In cPanel Terminal
npm run verify:cpanel
```

This will check:
- ✅ Node.js version
- ✅ Build output exists
- ✅ Required directories
- ✅ Environment variables
- ✅ Package scripts

## Support & Troubleshooting

**See `CPANEL_TROUBLESHOOTING.md` for detailed troubleshooting guide.**

Quick checks:
1. Run: `npm run verify:cpanel`
2. Check cPanel error logs
3. Verify Node.js version (22.18.0 is good ✅)
4. Ensure all steps completed in order
5. Test health endpoint: `https://demo.martindokshomes.com/api/health`

If build fails due to memory limits, contact hosting support.
