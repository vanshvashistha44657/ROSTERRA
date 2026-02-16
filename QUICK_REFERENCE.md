# Quick Reference - Recent Changes

## 🎯 What Was Changed

### 1. **Sidebar** 
- "All Profiles" → "Dashboard" ✅

### 2. **Frame Face Roaster Response**
- "Total Views Rate" → "Avg View Rate" ✅
- Now calculates actual average ✅

### 3. **User Approval System** 
- New users start as "Pending" ✅
- Admin must approve before login ✅
- Notification system for admin ✅

---

## 🚀 Quick Start

### Test User Approval System:

**1. Create New User:**
```
1. Go to http://localhost:5173/signup
2. Fill form and submit
3. See "Account Created - Pending Approval" message
4. Try to login → See "Pending Approval" message
```

**2. Admin Approves:**
```
1. Login as admin
2. Go to /users page
3. See yellow notification: "1 User Awaiting Approval"
4. Click green checkmark to approve
5. User can now login!
```

---

## 📍 Where Things Are

| Feature | Location |
|---------|----------|
| Sidebar "Dashboard" | `frontend/src/components/Sidebar.jsx` |
| Avg View Rate | `frontend/src/pages/RoasterResponse.jsx` |
| User Status Field | `server/models/User.js` |
| Signup Logic | `server/routes/auth.js` |
| Login Check | `server/routes/auth.js` |
| Approve/Deny UI | `frontend/src/pages/Users.jsx` |
| Pending Message | `frontend/src/pages/Login.jsx` |
| Success Message | `frontend/src/pages/Signup.jsx` |

---

## 🔑 Key API Endpoints

```
POST /api/auth/signup       - Create pending user
POST /api/auth/login        - Login (checks status)
GET  /api/users             - Get all users (admin)
GET  /api/users/pending     - Get pending users (admin)
PUT  /api/users/:id/approve - Approve user (admin)
PUT  /api/users/:id/reject  - Reject user (admin)
```

---

## 🎨 UI Elements

### Status Badges:
- 🟢 **Approved** - Green with checkmark
- 🟡 **Pending** - Yellow with clock (pulsing)
- 🔴 **Rejected** - Red with X

### Notification Bar:
- Yellow bar at top of Users page
- Shows pending count
- Animated bell icon
- Dismissible

### Action Buttons:
- ✅ Approve (green)
- ❌ Reject (red)
- 🗑️ Delete (red)

---

## 💡 Quick Tips

**For Testing:**
1. Create user → Status = Pending
2. Try login → Blocked with message
3. Admin approves → Status = Approved
4. Try login → Success!

**For Admin:**
- Notification appears automatically
- Poll updates every 30 seconds
- One-click approve/reject

**For Users:**
- Clear feedback on signup
- Can't login until approved
- See status in login attempt

---

## 🐛 Common Issues

**Issue:** Can't login after signup
**Solution:** Account needs admin approval first

**Issue:** Don't see pending users
**Solution:** Refresh page or wait for polling (30s)

**Issue:** Notification doesn't appear
**Solution:** Check if you're logged in as admin

---

## 📝 Status Flow

```
Signup → Pending → Admin Reviews → Approved/Rejected
                                      ↓
                               Can Login / Cannot Login
```

---

**All systems operational!** ✅
