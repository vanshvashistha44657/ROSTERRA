# Manual Data Entry Feature Guide

## Overview
This feature allows users and admins to manually add roaster profile data directly from the Dashboard. All data is automatically saved to the MongoDB database and synced across all users.

## Features

### 1. **Manual Entry Button**
- Located on the Dashboard main page (top-right corner)
- Clearly labeled as "Add Manual Entry"
- Opens a modal form for data entry

### 2. **Data Entry Form**
The form includes fields for:
- **Name** (Required) - Roaster's name
- **Profile Link** - Social media profile URL
- **Platform** - Instagram, YouTube, Twitter, Facebook, TikTok, LinkedIn, or Other
- **Followers** - Number of followers (numeric)
- **Followers Display** - Display format (e.g., "10K", "1M")
- **State** - Geographic location
- **Category** - Content category (Tech, Fashion, Food, etc.)
- **Commercials** - Commercial information
- **Phone Number** - Contact phone
- **Sex** - Gender
- **Age** - Age in years
- **Email** - Contact email
- **Response** - Notes or response text
- **Status** - Pending, Accepted, or Rejected

### 3. **Database Storage**
- All entries are saved to MongoDB backend
- Each entry is associated with the logged-in user
- Data persists across sessions
- Automatic synchronization between frontend and backend

### 4. **User Management**
- Each user can only see and edit their own entries
- Admin users can manage all entries
- Secure authentication required

## Technical Implementation

### Frontend Components

1. **ManualDataEntryModal.jsx**
   - Modal form component
   - Form validation
   - Error handling
   - Loading states

2. **Dashboard.jsx**
   - "Add Manual Entry" button
   - Success/error notifications
   - Modal state management

3. **DataContext.jsx**
   - Global state management
   - API integration
   - Automatic data synchronization

4. **api.js**
   - API utility functions
   - Authentication headers
   - Error handling

### Backend API Endpoints

1. **POST /api/roasters**
   - Create single roaster profile
   - Requires authentication
   - Validates data

2. **GET /api/roasters**
   - Get all roaster profiles for user
   - Sorted by creation date
   - Returns array of profiles

3. **PUT /api/roasters/:id**
   - Update existing profile
   - User can only update their own data

4. **DELETE /api/roasters/:id**
   - Delete single profile
   - User can only delete their own data

### Database Schema

```javascript
{
  name: String,
  profileLink: String,
  platform: String,
  followers: Number (default: 0),
  followersDisplay: String,
  state: String,
  category: String,
  commercials: String,
  phoneNumber: String,
  sex: String,
  age: Number,
  email: String,
  response: String,
  status: String (enum: 'pending', 'accepted', 'rejected'),
  userId: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Setup Instructions

### 1. Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rosterra
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Start MongoDB

Ensure MongoDB is running:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongodb
```

### 4. Start Development Servers

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Usage Guide

### For Users:

1. **Login** to your account
2. Navigate to the **Dashboard**
3. Click **"Add Manual Entry"** button (top-right)
4. Fill in the form with roaster information
5. Click **"Save Entry"** to submit
6. Data is automatically saved to the database
7. Success notification appears on save

### For Admins:

1. Login with admin credentials
2. Access all user entries through the appropriate admin panel
3. Can view, edit, and manage all entries
4. Same manual entry process as regular users

## Data Flow

```
User Input → Modal Form → Form Validation → API Call → Backend Server
                                                            ↓
                                                      MongoDB Save
                                                            ↓
                                                   Return Saved Data
                                                            ↓
Frontend Update ← Context Update ← API Response ← Backend Response
```

## Security Features

1. **Authentication Required**
   - JWT token validation
   - User-specific data access

2. **Data Validation**
   - Frontend form validation
   - Backend schema validation
   - Type checking

3. **Authorization**
   - Users can only access their own data
   - Admin role for full access

## Error Handling

- Network errors: Displays error notification
- Validation errors: Shows field-specific errors
- Authentication errors: Redirects to login
- Database errors: Graceful fallback to localStorage

## Future Enhancements

- Bulk import from CSV/Excel
- Data export functionality
- Advanced filtering and search
- Real-time collaboration
- Data analytics and reporting
- Email notifications
- File attachments support

## Troubleshooting

### Issue: Data not saving
- Check if MongoDB is running
- Verify backend server is running
- Check browser console for errors
- Ensure user is logged in

### Issue: Modal not opening
- Check browser console for errors
- Verify React components are imported correctly
- Clear browser cache

### Issue: Authentication errors
- Verify JWT token is valid
- Check if token is expired
- Re-login if necessary

## Support

For issues or questions:
1. Check the browser console for errors
2. Review server logs for backend issues
3. Verify environment variables are set correctly
4. Ensure all dependencies are installed
