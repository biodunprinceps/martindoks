# MANUAL ADMIN API TESTING GUIDE

## Your Issue: "I can only login but can't perform any admin action"

Based on the diagnostic data you shared:

- ✅ All JSON files exist and have correct data on cPanel
- ✅ Blog post "why-real-estate-is-a-great-investment..." exists in blog-posts.json
- ❌ But DELETE returns 404 (Not Found)
- ❌ Other admin actions also fail

## Most Likely Causes:

### 1. **cPanel is Running OLD Cached Code** (MOST LIKELY)

Even though you uploaded v4, cPanel's Node.js might still be serving the old v1/v2/v3 build.

**FIX:**

1. cPanel → Setup Node.js App → Click **STOP**
2. cPanel → File Manager → Navigate to `public_html/.next/`
3. **DELETE** the entire `.next` folder
4. Go back to Setup Node.js App → Click **START**
5. Wait 30 seconds
6. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
7. Try admin actions again

---

### 2. **Browser is Caching Old JavaScript**

Your browser might be serving old JavaScript files.

**FIX:**

1. Open browser DevTools (`F12` or `Right-click → Inspect`)
2. Go to **Network** tab
3. Check "Disable cache"
4. Hard refresh: `Cmd+Shift+R` or `Ctrl+Shift+R`
5. Try admin actions again
6. Watch Network tab - you should see requests to `/api/admin/blog/...`

---

### 3. **CORS or Network Issues**

The API requests might be blocked.

**CHECK:**

1. Open browser DevTools → **Console** tab
2. Try to delete a blog post
3. Look for errors:
   - Red CORS errors?
   - Network errors?
   - 404 errors?
4. Share screenshot of console errors

---

### 4. **Next.js Routing Issue**

The `output: "standalone"` in next.config.ts might be affecting routing.

**TEST:**
Visit these URLs directly in browser (you should see JSON, not HTML):

1. **Debug Data:**  
   `https://martindokshomes.com/api/debug/data`  
   Should show: JSON with file info
2. **Blog List:**  
   `https://martindokshomes.com/api/admin/blog`  
   Should show: JSON with list of blog posts
3. **Single Blog:**  
   `https://martindokshomes.com/api/admin/blog/why-real-estate-is-a-great-investment-the-power-of-property`  
   Should show: JSON with that specific blog post

If ANY of these show HTML instead of JSON, **the API routes aren't working**.

---

## Manual API Test (Using Browser)

### Test DELETE (The Failing Action):

1. Open browser DevTools (`F12`)
2. Go to **Console** tab
3. Paste this code:

```javascript
// Test DELETE blog post
fetch(
  "https://martindokshomes.com/api/admin/blog/why-real-estate-is-a-great-investment-the-power-of-property",
  {
    method: "DELETE",
  }
)
  .then((res) => {
    console.log("Status:", res.status);
    return res.json();
  })
  .then((data) => {
    console.log("Response:", data);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
```

4. Press Enter
5. Look at the output:
   - **Status 200** = SUCCESS (post deleted)
   - **Status 404** = Post not found (even though diagnostic showed it exists = OLD CODE)
   - **Status 500** = Server error
   - **Network error** = Request blocked

---

## What To Share With Me:

1. **Result of visiting these URLs in browser:**

   - `https://martindokshomes.com/api/debug/data`
   - `https://martindokshomes.com/api/admin/blog`

2. **Screenshot of browser Console when trying to delete:**

   - Open DevTools → Console tab
   - Try to delete a blog post in admin panel
   - Take screenshot showing any errors

3. **Did you delete .next folder?**

   - Yes/No
   - Did Node.js app restart successfully?

4. **What exact error message do you see?**
   - In admin panel UI
   - In browser console
   - In cPanel Node.js logs

---

## Quick Verification Commands:

### On cPanel (via SSH or Terminal):

```bash
# Check if .next folder exists
ls -la /home/martindo/martindokshomes.com/.next

# Check Node.js process
ps aux | grep node

# Check recent logs
tail -50 /home/martindo/logs/martindokshomes.com.log
```

### On Your Computer:

```bash
# Run API test script
cd /Users/princeps/Downloads/src
node test-admin-api.js
```

This will test all API endpoints and show which ones are failing.

---

## Expected Behavior:

After clearing cache and restarting:

1. Visit admin panel → Login ✅
2. Go to Blog Posts page ✅
3. See list of 3 blog posts ✅
4. Click Delete on any post → Shows confirm dialog ✅
5. Click OK → Post disappears from list ✅
6. Refresh page → Post still gone ✅

If step 4 or 5 fails, the issue is:

- Old cached JavaScript in browser
- Old cached .next build on server
- API routes not being reached at all

---

## Nuclear Option (If Nothing Works):

1. **Stop Node.js app** completely
2. **Delete EVERYTHING in public_html/**
3. **Re-upload martindokshomes-FINAL-v4-WITH-DEBUG.zip**
4. **Extract it fresh**
5. **Upload .env.local** with production settings
6. **Start Node.js app**
7. **Wait 60 seconds** for full startup
8. **Clear browser cache completely**
9. **Try again**
