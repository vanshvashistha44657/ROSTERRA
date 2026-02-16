# Manual Data Entry Feature - Flow Diagram

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. User Login
   │
   ├─> Navigate to Dashboard
   │
   ├─> See "Add Manual Entry" Button (Blue, Top-Right)
   │
   ├─> Click Button
   │
   ├─> Modal Opens with Form
   │   │
   │   ├─> Fill in Roaster Information
   │   │   - Name* (required)
   │   │   - Profile Link
   │   │   - Platform (dropdown)
   │   │   - Followers
   │   │   - Followers Display
   │   │   - State
   │   │   - Category
   │   │   - Commercials
   │   │   - Phone Number
   │   │   - Sex (dropdown)
   │   │   - Age
   │   │   - Email
   │   │   - Response (textarea)
   │   │   - Status (dropdown)
   │   │
   │   ├─> Click "Save Entry"
   │   │
   │   └─> See Loading State ("Saving...")
   │
   ├─> Data Submitted to Backend
   │
   ├─> Success/Error Notification Appears
   │
   └─> Modal Closes (on success)
```

## Technical Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNICAL DATA FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Frontend (React)
   │
   ├─> Dashboard.jsx
   │   │
   │   ├─> "Add Manual Entry" Button Clicked
   │   │
   │   └─> setIsModalOpen(true)
   │
   ├─> ManualDataEntryModal.jsx
   │   │
   │   ├─> User Fills Form
   │   │
   │   ├─> Form Validation
   │   │   - Required fields check
   │   │   - Email format validation
   │   │   - Number type validation
   │   │
   │   ├─> onSubmit() called
   │   │
   │   └─> Passes data to parent (Dashboard)
   │
   ├─> Dashboard.handleManualDataSubmit()
   │   │
   │   └─> Calls roasterAPI.create(data)
   │
   ├─> api.js (roasterAPI.create)
   │   │
   │   ├─> Prepare request
   │   │   - Add Authorization header
   │   │   - Add Content-Type header
   │   │   - Stringify body
   │   │
   │   ├─> fetch POST to /api/roasters
   │   │
   │   └─> Parse response
   │
   │
   ▼
Backend (Node.js + Express)
   │
   ├─> server.js
   │   │
   │   └─> Route to /api/roasters
   │
   ├─> routes/roasters.js
   │   │
   │   ├─> POST / endpoint
   │   │
   │   └─> authenticate middleware
   │
   ├─> middleware/auth.js
   │   │
   │   ├─> Verify JWT token
   │   │
   │   ├─> Decode user info
   │   │
   │   └─> Attach user to req.user
   │
   ├─> routes/roasters.js (continued)
   │   │
   │   ├─> Extract req.body
   │   │
   │   ├─> Add userId: req.user._id
   │   │
   │   └─> RoasterProfile.create()
   │
   │
   ▼
Database (MongoDB)
   │
   ├─> models/RoasterProfile.js
   │   │
   │   ├─> Validate schema
   │   │
   │   ├─> Apply defaults
   │   │
   │   ├─> Add timestamps
   │   │
   │   └─> Save to collection
   │
   └─> Return saved document
   │
   │
   ▼
Response Flow (Back to Frontend)
   │
   ├─> Backend sends response
   │   - Status: 201 Created
   │   - Body: saved document JSON
   │
   ├─> api.js receives response
   │   - Parse JSON
   │   - Return data
   │
   ├─> Dashboard.handleManualDataSubmit()
   │   │
   │   ├─> addRoasterProfiles([savedData])
   │   │   - Updates DataContext
   │   │   - Saves to localStorage
   │   │
   │   └─> showNotification("Success!", "success")
   │
   ├─> Success Notification Displayed
   │   - Green toast, top-right
   │   - Auto-dismiss after 5 seconds
   │
   ├─> Modal Closes
   │
   └─> Dashboard Updates
       - New data available in context
       - Can be used by other components
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                           │
└─────────────────────────────────────────────────────────────────┘

App
 │
 ├─> DataProvider (Context)
 │   │
 │   ├─> State: roasterProfiles[]
 │   │
 │   ├─> Function: addRoasterProfiles()
 │   │
 │   └─> Function: loadRoasterProfilesFromBackend()
 │
 └─> Dashboard
     │
     ├─> State: isModalOpen
     │
     ├─> State: notification {show, message, type}
     │
     ├─> Function: handleManualDataSubmit()
     │
     ├─> Function: showNotification()
     │
     ├─> UI: "Add Manual Entry" Button
     │   └─> onClick: setIsModalOpen(true)
     │
     ├─> UI: Notification (conditional)
     │   └─> Renders when notification.show === true
     │
     └─> ManualDataEntryModal
         │
         ├─> Props:
         │   - isOpen
         │   - onClose
         │   - onSubmit
         │
         ├─> State: formData
         │
         ├─> State: isSubmitting
         │
         ├─> State: error
         │
         ├─> Function: handleChange()
         │
         ├─> Function: handleSubmit()
         │
         └─> UI Components:
             - Header with close button
             - Form with all fields
             - Submit button
             - Cancel button
```

## API Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       API STRUCTURE                              │
└─────────────────────────────────────────────────────────────────┘

utils/api.js
 │
 ├─> getAuthToken()
 │   └─> Returns: JWT token from localStorage
 │
 ├─> getAuthHeaders()
 │   └─> Returns: Headers object with Authorization
 │
 ├─> authAPI
 │   ├─> login(email, password)
 │   ├─> signup(name, email, password)
 │   └─> verifyToken()
 │
 └─> roasterAPI
     ├─> getAll()
     │   └─> GET /api/roasters
     │
     ├─> getById(id)
     │   └─> GET /api/roasters/:id
     │
     ├─> create(data) ⭐ NEW FEATURE
     │   └─> POST /api/roasters
     │
     ├─> createBulk(roasters)
     │   └─> POST /api/roasters/bulk
     │
     ├─> update(id, data)
     │   └─> PUT /api/roasters/:id
     │
     ├─> delete(id)
     │   └─> DELETE /api/roasters/:id
     │
     └─> clearAll()
         └─> DELETE /api/roasters/clear/all
```

## Database Schema Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE OPERATIONS                          │
└─────────────────────────────────────────────────────────────────┘

Form Data Input
 │
 ├─> Frontend Validation
 │   - Required fields
 │   - Type checking
 │   - Format validation
 │
 ├─> API Request
 │   - Add Authorization header
 │   - JSON stringify
 │
 ├─> Backend Validation
 │   - JWT authentication
 │   - Schema validation
 │
 ├─> Data Transformation
 │   - Add userId from token
 │   - Convert types (string to number)
 │   - Apply defaults
 │
 ├─> MongoDB Operation
 │   - RoasterProfile.create()
 │   - Validation against schema
 │   - Add timestamps (createdAt, updatedAt)
 │
 ├─> Indexing
 │   - Index on userId (for fast queries)
 │   - Index on status (for filtering)
 │
 └─> Response
     - Return saved document
     - Include _id, createdAt, updatedAt
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                              │
└─────────────────────────────────────────────────────────────────┘

DataContext (Global State)
 │
 ├─> roasterProfiles[] (State)
 │   │
 │   ├─> Loaded from MongoDB on mount
 │   │
 │   ├─> Updated on addRoasterProfiles()
 │   │
 │   └─> Synced to localStorage
 │
 ├─> Dashboard (Local State)
 │   │
 │   ├─> isModalOpen (boolean)
 │   │   - Controls modal visibility
 │   │
 │   └─> notification (object)
 │       - Controls notification display
 │
 └─> ManualDataEntryModal (Local State)
     │
     ├─> formData (object)
     │   - All form fields
     │   - Updated on user input
     │
     ├─> isSubmitting (boolean)
     │   - Loading state
     │   - Disables buttons
     │
     └─> error (string)
         - Error message
         - Displayed to user
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ERROR HANDLING                               │
└─────────────────────────────────────────────────────────────────┘

Error Source
 │
 ├─> Network Error
 │   └─> Show: "Network error, please try again"
 │
 ├─> Authentication Error (401)
 │   └─> Redirect to login
 │
 ├─> Validation Error (400)
 │   └─> Show: Specific field errors
 │
 ├─> Server Error (500)
 │   └─> Show: "Server error, please try again later"
 │
 └─> Success (201)
     └─> Show: "Data entry saved successfully!"

Error Display:
 - Modal error (for form errors)
 - Notification toast (for general errors)
 - Console log (for debugging)
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY CHECKS                             │
└─────────────────────────────────────────────────────────────────┘

1. Authentication
   │
   ├─> User must be logged in
   │
   ├─> JWT token in localStorage
   │
   └─> Token sent with every API request

2. Authorization
   │
   ├─> Backend verifies JWT token
   │
   ├─> Extracts userId from token
   │
   └─> User can only access their own data

3. Validation
   │
   ├─> Frontend: Form validation
   │
   ├─> Backend: Schema validation
   │
   └─> MongoDB: Type enforcement

4. Data Isolation
   │
   ├─> Each record has userId
   │
   ├─> Queries filter by userId
   │
   └─> Users cannot see others' data
```

---

## Visual UI Flow

```
┌──────────────────────────────────────────────────────────┐
│  Dashboard Page                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Dashboard          [+ Add Manual Entry] ←BUTTON   │ │
│  │  Welcome back!                                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [Metric Cards]                                          │
│  [Charts]                                                │
│  [Tables]                                                │
└──────────────────────────────────────────────────────────┘

                    ↓ Click Button

┌──────────────────────────────────────────────────────────┐
│  [X] Add Manual Data Entry                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Name*: [________________]  Profile: [___________] │ │
│  │  Platform: [▼ Select     ]  Followers: [________] │ │
│  │  State: [________________]  Category: [__________] │ │
│  │  Phone: [________________]  Sex: [▼ Select      ] │ │
│  │  Age: [__]  Email: [____________________________________] │ │
│  │  Response: [_______________________________________] │ │
│  │            [_______________________________________] │ │
│  │  Status: [▼ Pending     ]                          │ │
│  └────────────────────────────────────────────────────┘ │
│                                    [Cancel] [Save Entry] │
└──────────────────────────────────────────────────────────┘

                    ↓ Click Save

┌──────────────────────────────────────────────────────────┐
│                          ┌──────────────────────────────┐│
│  Dashboard               │ ✓ Data entry saved!         ││ ← Toast
│  Welcome back!           └──────────────────────────────┘│
│                                                          │
│  [Metric Cards]                                          │
│  [Charts]                                                │
│  [Tables]                                                │
└──────────────────────────────────────────────────────────┘
```

---

## Summary

This feature provides:

✅ **User-Friendly Interface**
- Single button on Dashboard
- Modal form with clear labels
- Validation feedback
- Success/error notifications

✅ **Robust Backend**
- MongoDB persistence
- JWT authentication
- User data isolation
- Error handling

✅ **Scalable Architecture**
- Clean separation of concerns
- Reusable API utilities
- Context-based state management
- Type-safe operations

✅ **Multi-User Support**
- Each user has their own data
- Admin can access all data
- Secure authentication
- Role-based access

---
