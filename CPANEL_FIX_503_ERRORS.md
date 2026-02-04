# Fix 503 Errors on cPanel - Complete Guide

## 🔴 Problem: Images Work But Page Navigation Returns 503 Errors

This means:

- ✅ Static files (images, CSS, JS) are being served by Apache
- ❌ Node.js server is **NOT running** or **NOT accessible**

---

## ✅ Solution: Start/Fix Node.js Application

### Step 1: Access Setup Node.js App

1. Login to **cPanel**
2. Navigate to **Software** section
3. Click **Setup Node.js App**

### Step 2: Check Application Status

Look at the status indicator:

- 🟢 **Green "Running"** = Server is running
- 🔴 **Red "Stopped"** or **No Status** = Server is NOT running

### Step 3: Install Dependencies (CRITICAL!)

Since we excluded `node_modules` from the ZIP to reduce size:

1. In the Node.js App interface, click **"Run NPM Install"** button
2. Wait for installation to complete (this may take 2-5 minutes)
3. Look for success message: "npm install completed successfully"

### Step 4: Configure Application

Set these values:

**Application Root:**

```
/home/yourusername/public_html/
```

(or wherever you extracted the ZIP)

**Application URL:**

```
http://demo.martindokshomes.com
```

**Application Startup File:**

```
server.js
```

**Node.js Version:**

```
18.x or higher (recommended: 18.x or 20.x)
```

### Step 5: Set Environment Variables

Click **"Add Variable"** and add these:

| Variable Name | Value      |
| ------------- | ---------- |
| NODE_ENV      | production |
| PORT          | 3000       |

### Step 6: Start the Server

1. Click **"Start"** button (or **"Restart"** if already running)
2. Wait for status to change to 🟢 **"Running"**
3. If it fails, check error logs (see below)

---

## 🔍 Troubleshooting

### Check 1: View Application Logs

In the Node.js App interface:

1. Click **"Show Logs"** or **"View Logs"**
2. Look for errors like:
   - `Cannot find module 'next'` → Run NPM Install again
   - `Port 3000 already in use` → Change PORT to 3001, 3002, etc.
   - `EADDRINUSE` → Port conflict, restart or change port

### Check 2: Test Server Connection

SSH into your server (if available) and run:

```bash
cd /home/yourusername/public_html/
node check-node-status.js
```

This will tell you if the server is running and responding.

### Check 3: Manual Server Test

SSH into your server and try starting manually:

```bash
cd /home/yourusername/public_html/
NODE_ENV=production PORT=3000 node server.js
```

Look for:

- ✅ `> Ready on http://localhost:3000` = SUCCESS
- ❌ Errors = Note the error and fix it

Press `Ctrl+C` to stop, then use cPanel to start it properly.

---

## 🚨 Common Issues & Fixes

### Issue 1: "Cannot find module 'next'"

**Cause:** Dependencies not installed  
**Fix:** Click "Run NPM Install" in cPanel Node.js App

### Issue 2: "Port 3000 already in use"

**Cause:** Another app is using port 3000  
**Fix:**

1. Change PORT variable to 3001
2. Update `.htaccess` line: `RewriteRule ^(.*)$ http://127.0.0.1:3001/$1 [P,L]`
3. Restart server

### Issue 3: "502 Bad Gateway" or "503 Service Unavailable"

**Cause:** Node.js server crashed or not running  
**Fix:**

1. Check logs for crash reason
2. Restart the application
3. Verify all environment variables are set

### Issue 4: Static files work, pages don't

**Cause:** Proxy not working correctly  
**Fix:**

1. Verify Apache `mod_proxy` and `mod_proxy_http` are enabled
2. Contact hosting support to enable these modules
3. Check `.htaccess` file is in root directory

### Issue 5: "npm install fails"

**Cause:** Insufficient memory or permissions  
**Fix:**

1. Contact hosting support to increase memory limit
2. Check file permissions (755 for directories, 644 for files)
3. Try installing locally and uploading full `node_modules`

---

## 📋 Pre-Deployment Checklist

Before uploading to cPanel:

- ✅ Run `npm run build` locally to verify build works
- ✅ Package created WITHOUT `node_modules` (faster upload)
- ✅ `.htaccess` file included in root
- ✅ `server.js` file included
- ✅ `.next/` build directory included

After uploading to cPanel:

- ✅ Extract ZIP to correct directory
- ✅ Run NPM Install via cPanel interface
- ✅ Set NODE_ENV=production and PORT=3000
- ✅ Start/Restart the application
- ✅ Verify status is "Running"
- ✅ Test website in browser

---

## 🔗 Quick Links

- **Test Homepage:** http://demo.martindokshomes.com/
- **Test API Health:** http://demo.martindokshomes.com/api/health
- **Test Static File:** http://demo.martindokshomes.com/images/hero/hero-background.jpg

If homepage works = Everything OK  
If API health fails = Node.js not running  
If static file fails = Apache issue or wrong directory

---

## 📞 Still Having Issues?

1. **Check logs** in cPanel Node.js App interface
2. **Take screenshots** of:
   - Node.js App status page
   - Error messages in logs
   - Browser console errors (F12)
3. **Contact hosting support** and provide:
   - "Need mod_proxy and mod_proxy_http enabled"
   - "Running Next.js application on port 3000"
   - Screenshots from step 2

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ cPanel shows status: 🟢 "Running"
- ✅ Homepage loads without errors
- ✅ Navigation to other pages works
- ✅ API routes respond (test `/api/health`)
- ✅ Browser console has no 503/502 errors
- ✅ Images, CSS, and JavaScript all load correctly

Good luck! 🚀
