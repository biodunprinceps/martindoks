# cPanel Cache Clearing Instructions

## Your data files are PERFECT! The issue is cached old code.

### Follow these steps EXACTLY:

#### 1. Stop Node.js App

- Go to cPanel → Setup Node.js App
- Click **STOP** button (wait for it to fully stop)

#### 2. Delete .next Cache Folder

- Go to cPanel → File Manager
- Navigate to `public_html/.next/`
- **DELETE the entire `.next` folder**
- This forces a complete rebuild

#### 3. Clear Browser Cache

- In your browser, press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- This clears cached JavaScript

#### 4. Restart Node.js App

- Go back to Setup Node.js App
- Click **START** button
- Wait 30 seconds for it to fully start

#### 5. Test Again

- Try DELETE: `https://martindokshomes.com/api/admin/blog/why-real-estate-is-a-great-investment-the-power-of-property`
- Try viewing: `https://martindokshomes.com/blog/why-real-estate-is-a-great-investment-the-power-of-property`
- Check admin panel CRUD operations

---

## Why This Works:

Your diagnostic showed:

- ✅ All JSON files exist with correct data
- ✅ Blog post with slug exists in blog-posts.json
- ✅ File permissions are fine (can read files)
- ✅ Working directory is correct

**BUT** you're still getting 404 errors = **Old code is cached**

The old v1/v2/v3 builds had static fallbacks. Even though we removed them in v4, cPanel is serving the OLD compiled JavaScript from `.next/cache/`.

Deleting `.next` folder forces cPanel to use your new v4 code.

---

## Alternative: Check Node.js Version

If the above doesn't work, verify:

1. Go to Setup Node.js App
2. Check "Node.js version" is set to **18.x or higher**
3. Check "Application mode" is set to **Production**
4. Make sure "Application startup file" is `server.js`

---

## Debug Logs to Check:

After restart, check cPanel → Setup Node.js App → View Logs

Look for these console.log messages we added:

```
Admin API: Loading blog post: why-real-estate-is-a-great-investment-the-power-of-property
Blog storage initialized. Data file: /home/martindo/martindokshomes.com/data/blog-posts.json
Blog posts loaded: 3
```

If you see these logs, the new code is running!
If you DON'T see these logs, old code is still cached.
