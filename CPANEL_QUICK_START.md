# cPanel Quick Start Guide

## 🚀 Deployment Checklist

### Before Uploading
- [ ] All files committed to git
- [ ] Tested build locally: `npm run build`
- [ ] Environment variables documented

### In cPanel - Step by Step

1. **Upload Files** (via FTP or File Manager)
   - Upload all files except `node_modules` and `.next`
   - Keep folder structure intact

2. **Create Node.js App** (in cPanel)
   - Go to: cPanel → Software → Node.js App
   - Create new application
   - Set Node.js version: **22.18.0** (or latest available)
   - Set application root to your project folder

3. **Set Environment Variables** (in cPanel Node.js App)
   ```
   NODE_ENV=production
   PORT=3000
   ```
   (Add others as needed: DATABASE_URL, RESEND_API_KEY, etc.)

4. **Install Dependencies**
   - Click "Run NPM Install"
   - ⚠️ **IGNORE** the content-type error if it appears
   - Wait for completion (5-10 minutes)

5. **Build Application** ⚠️ **CRITICAL STEP**
   - In Terminal or "Run NPM Script":
   ```bash
   npm run build
   ```
   - Wait for completion (2-5 minutes)

6. **Start Application**
   - Click "Start App" in cPanel
   - Wait for "Running" status

7. **Verify**
   - Visit: `https://demo.martindokshomes.com`
   - Test: `https://demo.martindokshomes.com/api/health`
   - Should see: `{"status":"ok",...}`

## ✅ Verification Commands

After deployment, run in Terminal:

```bash
# Full verification
npm run verify:cpanel

# Quick checks
node --version          # Should be 18+
ls -la .next            # Should exist
echo $NODE_ENV          # Should be "production"
```

## 🆘 Common Issues

| Issue | Quick Fix |
|-------|-----------|
| Content-type error after install | ✅ Normal - ignore it, continue to build step |
| App won't start | Check NODE_ENV=production is set |
| Build fails | Check Node version (18+), memory limits |
| Blank page | Run `npm run build` again |
| 404 errors | Check `.htaccess` and port number |

## 📚 Full Documentation

- **Detailed Guide:** `CPANEL_DEPLOYMENT.md`
- **Troubleshooting:** `CPANEL_TROUBLESHOOTING.md`

## 🎯 Success Indicators

✅ Health endpoint returns JSON  
✅ Homepage loads  
✅ Admin portal accessible  
✅ No console errors  
✅ Images load  

---

**Remember:** The content-type error after `npm install` is **NORMAL** - just continue to the build step!
