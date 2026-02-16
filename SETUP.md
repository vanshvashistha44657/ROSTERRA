# ROSTERRA Setup Guide

## Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend (.env):**
```bash
cd server
# Create .env file with:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rosterra
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

**Frontend (.env):**
```bash
cd frontend
# Create .env file with:
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
# Or run mongod directly
mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongodb
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:5173 (or the port shown in Terminal 2)
- Backend API: http://localhost:5000

## Manual Data Entry Feature

### How to Use:

1. **Login** to your account
2. Navigate to the **Dashboard**
3. Click the **"Add Manual Entry"** button (blue button in top-right corner)
4. Fill in the roaster profile information:
   - Name (required)
   - Profile Link
   - Platform (Instagram, YouTube, etc.)
   - Followers count
   - State, Category, etc.
5. Click **"Save Entry"**
6. Data is automatically saved to MongoDB
7. Success notification appears

### Features:
✅ Manual data entry from Dashboard
✅ All data saved to MongoDB database
✅ User-specific data isolation
✅ Real-time validation
✅ Error handling with notifications
✅ Responsive modal design
✅ Multi-user support
✅ Admin capabilities

## File Structure

```
ROSTERRA/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ManualDataEntryModal.jsx    ← NEW: Data entry form
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx               ← UPDATED: Added button
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── DataContext.jsx             ← UPDATED: API integration
│   │   └── utils/
│   │       └── api.js                      ← NEW: API utilities
│   └── .env                                ← NEW: Frontend config
├── server/
│   ├── models/
│   │   └── RoasterProfile.js               ← Database schema
│   ├── routes/
│   │   └── roasters.js                     ← API endpoints
│   ├── middleware/
│   │   └── auth.js                         ← Authentication
│   ├── server.js                           ← UPDATED: MongoDB connection
│   └── .env                                ← Backend config
└── MANUAL_DATA_ENTRY_GUIDE.md              ← NEW: Complete guide
```

## API Endpoints

### Roaster Profiles

- `POST /api/roasters` - Create single profile
- `GET /api/roasters` - Get all profiles for user
- `GET /api/roasters/:id` - Get single profile
- `PUT /api/roasters/:id` - Update profile
- `DELETE /api/roasters/:id` - Delete profile
- `POST /api/roasters/bulk` - Bulk import
- `DELETE /api/roasters/clear/all` - Clear all

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows:
tasklist | findstr mongod

# macOS/Linux:
ps aux | grep mongod

# Start MongoDB if not running
mongod
```

### Port Already in Use
```bash
# Backend (Port 5000)
# Find process using port
netstat -ano | findstr :5000
# Kill process
taskkill /PID <PID> /F

# Frontend (Port 5173)
# Usually auto-increments if busy
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Data Not Saving
1. Check MongoDB is running
2. Check backend server console for errors
3. Check browser console (F12) for errors
4. Verify you're logged in
5. Check network tab for API calls

## Development Tips

### Hot Reload
- Frontend: Vite provides instant hot reload
- Backend: Using `--watch` flag for auto-restart

### Database GUI Tools
- MongoDB Compass (Official GUI)
- Robo 3T (Free)
- Studio 3T (Advanced)

### Testing API Endpoints
```bash
# Using curl
curl -X POST http://localhost:5000/api/roasters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Test Roaster"}'

# Or use Postman, Insomnia, or Thunder Client
```

## Production Deployment

### Environment Variables
Update production values:
- Change `JWT_SECRET` to a secure random string
- Update `MONGODB_URI` to production database
- Set `NODE_ENV=production`

### Build Frontend
```bash
cd frontend
npm run build
# Output in: frontend/dist/
```

### Security Checklist
- [ ] Change default JWT_SECRET
- [ ] Use HTTPS
- [ ] Enable MongoDB authentication
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Add input sanitization
- [ ] Implement logging

## Support

For detailed information about the manual data entry feature, see:
- `MANUAL_DATA_ENTRY_GUIDE.md` - Complete feature documentation

## License

[Your License Here]
