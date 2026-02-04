# CPANEL ADMIN ACTIONS NOT WORKING - TROUBLESHOOTING

## Current Situation

**Problem:** "I can only login but can't perform any admin action on cPanel (DELETE, UPDATE, etc. all fail)"

**Diagnostic Results:** ✅ ALL JSON files exist and have correct data on cPanel server

- blog-posts.json: 3 posts ✅
- properties.json: 8 properties ✅
- testimonials.json: 2 testimonials ✅
- All files readable, correct sizes ✅

**Conclusion:** This is NOT a data problem. This is a **cached code problem**.

---

## Why This Is Happening

You uploaded 4 versions (v1, v2, v3, v4):

- v1-v3: Had static fallbacks (removed in stages)
- v4: Clean code, no fallbacks, uses only JSON files

**BUT:** cPanel's Node.js app is still running the **compiled v1/v2/v3 code** from `.next/` folder.

Even though you uploaded v4 source code, Next.js compiles it into `.next/` folder. If that folder already exists from v1/v2/v3, Node.js keeps using the old compiled code.

---

## THE FIX (Step-by-Step)

### Step 1: Stop Node.js Application

1. Login to cPanel
2. Go to **Setup Node.js App**
3. Find your application
4. Click **STOP** button
5. Wait until status shows "Stopped"

### Step 2: Delete Compiled Code Cache

1. Go to cPanel **File Manager**
2. Navigate to `public_html/`
3. Find `.next` folder
4. **Right-click → Delete**
5. Confirm deletion

### Step 3: Restart Application

1. Go back to **Setup Node.js App**
2. Click **START** button
3. **WAIT 60 SECONDS** for full initialization
4. Check status shows "Running"

### Step 4: Clear Browser Cache

1. Open your browser
2. Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Or: DevTools (F12) → Network tab → Check "Disable cache"

### Step 5: Test Admin Actions

1. Go to admin panel
2. Login
3. Try DELETE on a blog post
4. Try UPDATE on a property
5. Try CREATE new testimonial

---

## Verification Tests

### Test 1: API Routes Return JSON (Not HTML)

Visit these URLs in your browser. You should see **JSON data**, NOT HTML:

```
✅ https://martindokshomes.com/api/debug/data
✅ https://martindokshomes.com/api/admin/blog
✅ https://martindokshomes.com/api/admin/blog/why-real-estate-is-a-great-investment-the-power-of-property
```

If you see HTML error pages, API routes aren't working.

### Test 2: Browser Console Shows No Errors

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try to delete a blog post
4. You should see:

   ```
   ✅ DELETE /api/admin/blog/... 200 (OK)
   ```

   NOT:

   ```
   ❌ DELETE /api/admin/blog/... 404 (Not Found)
   ❌ DELETE /api/admin/blog/... 500 (Internal Server Error)
   ```

### Test 3: Network Tab Shows Correct Requests

1. Open DevTools (F12) → **Network** tab
2. Try to delete a blog post
3. Find the DELETE request in list
4. Click on it
5. Check:
   - Request URL: Should be `/api/admin/blog/...`
   - Status Code: Should be `200` (not 404 or 500)
   - Response: Should show JSON like `{"message": "Blog post deleted successfully"}`

---

## Alternative: Automated Test Script

Run this to test ALL API endpoints:

```bash
cd /Users/princeps/Downloads/src
node test-admin-api.js
```

This will output:

- ✅ Which endpoints work
- ❌ Which endpoints fail
- 📊 Response times, status codes, error messages

---

## If It STILL Doesn't Work

### Check cPanel Node.js Settings:

1. **Application Mode:** Should be `Production`
2. **Node.js Version:** Should be `18.x` or higher
3. **Application Startup File:** Should be `server.js`
4. **Application Root:** Should be `public_html` or wherever you extracted
5. **Environment Variables:** Check if `.env.local` exists with correct SITE_URL

### Check File Permissions:

```bash
# data/ folder should be writable
chmod 755 /home/martindo/martindokshomes.com/data/
chmod 644 /home/martindo/martindokshomes.com/data/*.json
```

### Check Node.js Logs:

1. Go to cPanel → Setup Node.js App
2. Click **View Logs**
3. Look for errors:
   - ❌ "ENOENT: no such file or directory" = File permission issue
   - ❌ "Cannot read properties" = Old code still running
   - ❌ "404" = Routes not found = API routes not loading
   - ✅ "Loading blog posts from..." = New code is running!

---

## Nuclear Option (Complete Reset)

If NOTHING works:

1. **Backup data files:**

   - Download `data/blog-posts.json`
   - Download `data/properties.json`
   - Download `data/testimonials.json`
   - Download `data/admin-users.json`
   - Download `data/newsletter-subscribers.json`

2. **Delete everything:**

   ```bash
   # In cPanel File Manager, delete:
   - All files in public_html/
   - All folders in public_html/
   ```

3. **Fresh upload:**

   - Upload `martindokshomes-FINAL-v4-WITH-DEBUG.zip`
   - Extract it
   - Delete the ZIP

4. **Restore data:**
   - Upload your backed up JSON files to `data/` folder
5. **Create .env.local:**

   ```
   NEXT_PUBLIC_SITE_URL=https://martindokshomes.com
   NODE_ENV=production
   ```

6. **Setup Node.js App:**

   - Application Root: `public_html`
   - Startup File: `server.js`
   - Mode: Production
   - Click **Start**

7. **Wait 2 minutes** for full startup

8. **Test**

---

## Expected Console Logs (If v4 Is Running)

When you perform admin actions, cPanel logs should show:

```
Admin API: Loading blog post by slug: why-real-estate-is-a-great-investment-the-power-of-property
Loading blog posts from: /home/martindo/martindokshomes.com/data/blog-posts.json
Blog file size: 16112 bytes
Loaded blog posts count: 3
Admin API: Blog post found: Why Real Estate is a Great Investment...
```

If you DON'T see these logs, **old code is still running**.

---

## Files to Check/Update:

- ✅ `/Users/princeps/Downloads/src/martindokshomes-FINAL-v4-WITH-DEBUG.zip` (ready to upload)
- ✅ `MANUAL_API_TESTING.md` (manual testing guide)
- ✅ `test-admin-api.js` (automated testing script)
- ✅ `CPANEL_CACHE_CLEAR.md` (cache clearing instructions)

---

## Quick Checklist:

- [ ] Stopped Node.js app
- [ ] Deleted `.next` folder
- [ ] Restarted Node.js app
- [ ] Waited 60 seconds
- [ ] Cleared browser cache
- [ ] Tested API URLs directly (return JSON?)
- [ ] Checked browser console (any errors?)
- [ ] Checked cPanel logs (new console.log messages?)
- [ ] Tested DELETE action
- [ ] Tested UPDATE action
- [ ] Tested CREATE action

If ALL of the above are done and it STILL fails, share:

1. Screenshot of browser console errors
2. Screenshot of Network tab showing failed request
3. Copy of cPanel Node.js logs
4. Result of visiting `/api/debug/data` URL
