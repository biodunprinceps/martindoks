# cPanel Troubleshooting Guide

Quick reference for common cPanel deployment issues.

## Quick Fixes

### Issue: "Content type before operation doesn't equal content type after operation"

**This is NORMAL!** cPanel checks the app immediately after `npm install`, but Next.js needs to be built first.

**Solution:**
1. ✅ Ignore this error
2. Run `npm run build` manually
3. Start the app

---

### Issue: Application won't start

**Checklist:**
1. ✅ Is `NODE_ENV=production` set in cPanel environment variables?
2. ✅ Did you run `npm run build` after `npm install`?
3. ✅ Check the port number matches `.htaccess` (usually 3000)
4. ✅ Verify Node.js version is 18+ (you have 22.18.0 ✅)

**Quick test:**
```bash
# In cPanel Terminal
npm run verify:cpanel
```

---

### Issue: Build fails

**Common causes:**

1. **Memory limit exceeded**
   - cPanel may limit to 512MB
   - **Fix:** Contact hosting provider to increase memory limit
   - Or try: `NODE_OPTIONS=--max-old-space-size=1024 npm run build`

2. **Node version mismatch**
   - **Fix:** Ensure cPanel uses Node 18+ (you have 22.18.0 ✅)

3. **Missing dependencies**
   - **Fix:** 
     ```bash
     rm -rf node_modules package-lock.json
     npm install
     npm run build
     ```

4. **TypeScript errors**
   - **Fix:** Check build output for specific errors
   - Some warnings are OK, but errors must be fixed

---

### Issue: App starts but shows blank page or errors

**Check:**
1. ✅ Check browser console for errors
2. ✅ Check cPanel error logs
3. ✅ Verify `.next` directory exists and has files
4. ✅ Test health endpoint: `https://demo.martindokshomes.com/api/health`

**Health endpoint should return:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-13T...",
  "environment": "production"
}
```

---

### Issue: Images not loading

**Check:**
1. ✅ `public/images/` directory exists
2. ✅ File permissions: `chmod -R 755 public`
3. ✅ Image paths in code are correct
4. ✅ Check browser network tab for 404 errors

---

### Issue: Uploads not working

**Check:**
1. ✅ `public/uploads/` directory exists
2. ✅ Directory is writable: `chmod -R 755 public/uploads`
3. ✅ Check cPanel file permissions
4. ✅ Verify environment variables are set

---

### Issue: Admin portal not accessible

**Check:**
1. ✅ Visit: `https://demo.martindokshomes.com/admin`
2. ✅ Check if login page loads
3. ✅ Verify default credentials (if using)
4. ✅ Check browser console for errors

---

## Verification Commands

Run these in cPanel Terminal after deployment:

```bash
# 1. Verify setup
npm run verify:cpanel

# 2. Check if build exists
ls -la .next

# 3. Test health endpoint (if app is running)
curl http://localhost:3000/api/health

# 4. Check Node version
node --version

# 5. Check environment variables
echo $NODE_ENV
echo $PORT
```

---

## Step-by-Step Recovery

If everything is broken, start fresh:

```bash
# 1. Stop the application in cPanel

# 2. Clean install
rm -rf node_modules package-lock.json .next

# 3. Reinstall
npm install

# 4. Set environment (in cPanel, not terminal)
NODE_ENV=production
PORT=3000

# 5. Build
npm run build

# 6. Verify
npm run verify:cpanel

# 7. Start app in cPanel
```

---

## Common Error Messages

### "Cannot find module 'next'"
- **Cause:** Dependencies not installed
- **Fix:** Run `npm install`

### "Error: ENOENT: no such file or directory, open '.next/BUILD_ID'"
- **Cause:** App not built
- **Fix:** Run `npm run build`

### "Port 3000 is already in use"
- **Cause:** Another app using the port
- **Fix:** Change PORT in cPanel or stop other app

### "Module not found: Can't resolve '...'"
- **Cause:** Missing dependency
- **Fix:** Run `npm install` or add missing package

### "Failed to prepare Next.js app"
- **Cause:** Build missing or corrupted
- **Fix:** Run `npm run build` again

---

## Getting Help

If issues persist:

1. **Check cPanel error logs:**
   - cPanel → Errors → Error Log
   - Look for Node.js/Next.js errors

2. **Check application logs:**
   - cPanel → Node.js App → View Logs

3. **Run verification:**
   ```bash
   npm run verify:cpanel
   ```

4. **Test locally first:**
   ```bash
   npm run build
   npm start
   # Visit http://localhost:3000
   ```

---

## Success Indicators

✅ App starts without errors in cPanel  
✅ Health endpoint returns: `{"status":"ok",...}`  
✅ Homepage loads: `https://demo.martindokshomes.com`  
✅ Admin portal accessible: `https://demo.martindokshomes.com/admin`  
✅ No errors in browser console  
✅ Images load correctly  
✅ Forms submit successfully  

---

**Last Updated:** 2025-12-13
