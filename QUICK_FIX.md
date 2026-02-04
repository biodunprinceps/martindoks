# 🚨 QUICK FIX - Admin Actions Not Working

## The Problem

✅ Data files exist and are correct on cPanel  
❌ But DELETE/UPDATE/CREATE actions fail  
💡 **Root Cause:** cPanel is serving OLD cached code

---

## The Solution (5 Minutes)

### 1️⃣ Stop App

cPanel → Setup Node.js App → **STOP**

### 2️⃣ Delete Cache

cPanel → File Manager → `public_html/.next/` → **DELETE**

### 3️⃣ Start App

Setup Node.js App → **START** → Wait 60 seconds

### 4️⃣ Clear Browser

Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### 5️⃣ Test

Admin panel → Try DELETE/UPDATE/CREATE

---

## Still Not Working?

### Quick Checks:

**1. Are API routes working?**  
Visit: `https://martindokshomes.com/api/debug/data`  
Should see: JSON data  
If you see: HTML error page → APIs broken

**2. Browser console errors?**  
Press F12 → Console tab → Try action  
Look for: Red errors about 404/500

**3. Network requests failing?**  
F12 → Network tab → Try action  
DELETE should show: Status 200 (not 404)

---

## Nuclear Option

If nothing works:

1. Backup `data/*.json` files
2. Delete everything in `public_html/`
3. Upload fresh `martindokshomes-FINAL-v4-WITH-DEBUG.zip`
4. Extract
5. Restore `data/` files
6. Start Node.js app
7. Wait 2 minutes
8. Test

---

## Get Help

Share these:

- Screenshot of browser Console (F12 → Console)
- Screenshot of Network tab showing failed request
- Result of visiting `/api/debug/data` URL
- cPanel Node.js logs

---

**Files Ready:**

- ✅ `martindokshomes-FINAL-v4-WITH-DEBUG.zip` (upload this)
- ✅ `CPANEL_FIX_ADMIN_ACTIONS.md` (full guide)
- ✅ `MANUAL_API_TESTING.md` (testing steps)
- ✅ `test-admin-api.js` (automated test)
