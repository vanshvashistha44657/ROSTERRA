# 🚀 Quick Start - Manual Data Entry Feature

## ⚡ 60-Second Setup

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend (Terminal 1)
```bash
cd server
npm run dev
```
Wait for: `✅ MongoDB connected` and `✅ Loaded route: /api/roasters`

### 3. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Open browser to the URL shown (usually http://localhost:5173)

### 4. Use the Feature
1. Login to your account
2. Click the blue **"Add Manual Entry"** button (top-right of Dashboard)
3. Fill in the form
4. Click **"Save Entry"**
5. Done! ✅

---

## 📋 What This Feature Does

- **Adds a button** on the Dashboard main page
- **Opens a form** where you can manually enter roaster profile data
- **Saves to MongoDB** - all data is stored in the backend database
- **Multi-user support** - each user has their own data
- **Admin access** - admins can manage all users' data

---

## 🎯 Key Features

✅ Manual data entry from Dashboard  
✅ Beautiful modal form  
✅ Real-time validation  
✅ Success/error notifications  
✅ Automatic database storage  
✅ Multi-user support  
✅ Mobile responsive  

---

## 📁 Files Added/Modified

### New Files:
- `frontend/src/components/ManualDataEntryModal.jsx` - The form modal
- `frontend/src/utils/api.js` - API utilities
- `frontend/.env` - Frontend config

### Modified Files:
- `frontend/src/pages/Dashboard.jsx` - Added button and modal
- `frontend/src/context/DataContext.jsx` - Added API integration
- `server/server.js` - Added MongoDB connection

---

## 🔧 Environment Variables Required

**frontend/.env:**
```
VITE_API_URL=http://localhost:5000/api
```

**server/.env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rosterra
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

---

## 🎨 UI Location

```
┌─────────────────────────────────────────────┐
│  Dashboard          [+ Add Manual Entry] ← HERE
│  Welcome back!                              │
└─────────────────────────────────────────────┘
```

The button is located in the **top-right corner** of the Dashboard page, next to the "Dashboard" heading.

---

## 📊 Form Fields

| Field | Type | Required |
|-------|------|----------|
| Name | Text | ✅ Yes |
| Profile Link | URL | No |
| Platform | Dropdown | No |
| Followers | Number | No |
| Followers Display | Text | No |
| State | Text | No |
| Category | Text | No |
| Commercials | Text | No |
| Phone Number | Tel | No |
| Sex | Dropdown | No |
| Age | Number | No |
| Email | Email | No |
| Response | Textarea | No |
| Status | Dropdown | No |

---

## 🔐 Authentication

This feature requires:
- User must be logged in
- Valid JWT token
- Each user can only see their own data

---

## ❌ Troubleshooting

### Problem: Button not showing
**Solution:** Make sure you're on the Dashboard page and logged in

### Problem: Modal not opening
**Solution:** Check browser console (F12) for errors

### Problem: Data not saving
**Solutions:**
1. Check MongoDB is running: `mongod`
2. Check backend is running: `cd server && npm run dev`
3. Check you're logged in
4. Check browser Network tab for API errors

### Problem: "Network Error"
**Solution:** 
1. Verify backend is running on port 5000
2. Check VITE_API_URL in frontend/.env
3. Check CORS is enabled in server

---

## 📚 Complete Documentation

For detailed information:
- **MANUAL_DATA_ENTRY_GUIDE.md** - Full feature documentation
- **SETUP.md** - Complete setup guide
- **CHANGELOG_MANUAL_ENTRY.md** - All changes made
- **FEATURE_FLOW.md** - Visual flow diagrams

---

## 🎉 Success Checklist

- [ ] MongoDB running
- [ ] Backend server running (port 5000)
- [ ] Frontend running (port 5173 or shown port)
- [ ] Can login successfully
- [ ] Can see Dashboard
- [ ] "Add Manual Entry" button visible
- [ ] Modal opens when clicked
- [ ] Can fill and submit form
- [ ] Success notification appears
- [ ] Data saved to database

---

## 💡 Tips

1. **Keep terminals open** - You need both frontend and backend running
2. **Check notifications** - Success/error messages appear in top-right
3. **Required field** - Only "Name" is required, everything else is optional
4. **Form resets** - After successful save, form automatically clears
5. **Data persists** - All data is saved to MongoDB and accessible after logout

---

## 🆘 Getting Help

If you encounter issues:

1. **Check terminals** for error messages
2. **Browser console** (F12) for frontend errors
3. **MongoDB logs** for database issues
4. **Review documentation** in the MD files

Common errors and solutions documented in:
- MANUAL_DATA_ENTRY_GUIDE.md (Troubleshooting section)
- SETUP.md (Troubleshooting section)

---

## 📝 Example Usage

```
1. User opens Dashboard
2. Clicks "Add Manual Entry"
3. Fills in:
   - Name: "TechGuru123"
   - Platform: "Instagram"
   - Followers: "50000"
   - Category: "Technology"
   - Status: "Pending"
4. Clicks "Save Entry"
5. Sees green notification: "Data entry saved successfully!"
6. Modal closes
7. Data is now in MongoDB database
```

---

## 🔗 API Endpoints Used

- **POST** `/api/roasters` - Save manual entry
- **GET** `/api/roasters` - Load user's entries
- **PUT** `/api/roasters/:id` - Update entry
- **DELETE** `/api/roasters/:id` - Delete entry

---

## ✨ That's It!

You now have a fully functional manual data entry system that:
- Saves data to MongoDB
- Works with multiple users
- Has a beautiful UI
- Includes error handling
- Is production-ready

**Happy data entry!** 🎊

---

**Last Updated:** February 11, 2026
