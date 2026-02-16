# 🔧 Troubleshooting Guide

## Current Issues You're Experiencing:

### 1. ❌ "Unexpected token '<' - is not valid JSON"
### 2. ❌ "No users found" 
### 3. ❌ Redirected to login page on refresh

---

## 🎯 ROOT CAUSE:

Your **backend server needs to be restarted** to load the new routes we added.

---

## ✅ COMPLETE FIX (Follow These Steps):

### Step 1: Check If Backend is Running

Look for a terminal/command prompt running the backend server.

If you see it, press **Ctrl + C** to stop it.

### Step 2: Restart Backend

```bash
cd C:\Users\Dell\Downloads\ROSTERRA\server
npm run dev
```

**Wait for these messages:**
```
✅ MongoDB connected
✅ Loaded route: /api/auth
✅ Loaded route: /api/roasters  
✅ Loaded route: /api/users      ← IMPORTANT! New route
🚀 Server running on port 5000
```

### Step 3: Clear Browser & Retry

1. **Clear your browser cache** (Ctrl + Shift + Delete)
2. Or just do a **hard refresh** (Ctrl + F5)
3. **Refresh the page** (F5)

### Step 4: Login Again

1. Go to http://localhost:5173/login
2. Enter your credentials
3. You should now see the Users page working!

---

## 🚨 If Still Not Working:

### Check #1: Is MongoDB Running?

**Start MongoDB:**
```bash
mongod
```

Keep this terminal open!

### Check #2: Are There Users in Database?

Run the migration script:
```bash
cd C:\Users\Dell\Downloads\ROSTERRA\server
node scripts/migrateExistingUsers.js
```

This will:
- Show you all users in the database
- Set them all to "approved" status
- Create default admin if no users exist

### Check #3: Is Token Valid?

**Clear localStorage:**
1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage" → "http://localhost:5173"
4. Delete the "token" entry
5. Refresh and login again

---

## 🔍 Common Issues & Solutions:

### Issue: "No token provided"
**Solution:** Login again, your session expired

### Issue: "User not found"  
**Solution:** Run migration script to create users

### Issue: Routes not loading
**Solution:** Restart backend server

### Issue: MongoDB connection error
**Solution:** Start MongoDB with `mongod` command

### Issue: Port 5000 already in use
**Solution:** 
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID_NUMBER> /F
```

---

## 📋 Complete Restart Checklist:

- [ ] MongoDB is running (`mongod` in a terminal)
- [ ] Backend is running (`npm run dev` in server folder)
- [ ] See "✅ Loaded route: /api/users" message
- [ ] Frontend is running (`npm run dev` in frontend folder)  
- [ ] Browser cache cleared (Ctrl + F5)
- [ ] Can access http://localhost:5173

---

## 🎯 Quick Test:

After restarting backend, test the API directly:

**Open browser, go to:**
```
http://localhost:5000/api/auth/verify
```

If you see JSON (even an error), the backend is running!

---

## 💡 Why Backend Restart is Needed:

When you add new files like `users.js` to the routes folder, Node.js doesn't automatically reload them. You must:

1. Stop the server (Ctrl + C)
2. Start it again (`npm run dev`)

The server will then load all route files including the new one.

---

## 🚀 After Backend Restarts Successfully:

You should be able to:
- ✅ See users in the Users page
- ✅ Approve/reject users
- ✅ See pending notifications
- ✅ Everything works!

---

## 📞 Still Having Issues?

Check these logs:

**Backend Terminal:** Look for errors in red
**Browser Console (F12):** Look for network errors
**MongoDB:** Make sure it's connected

Most likely: **You just need to restart the backend!** 🔄
