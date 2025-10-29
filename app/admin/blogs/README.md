# 👨‍💼 Admin Blog Management - Component Structure

## Purpose

This is the **ADMIN CONTROL PANEL** for managing ALL blogs with a modular, easy-to-understand component structure.

## 📁 File Structure

```
app/admin/blogs/
├── page.tsx                      # Main admin blog dashboard
├── CreateEditBlogModal.tsx       # Modal for creating/editing blogs
├── components/                   # Reusable UI components
│   ├── BlogStats.tsx            # Statistics cards (5 cards: total, published, pending, drafts, likes)
│   ├── BlogGridView.tsx         # Grid layout for blog cards
│   ├── BlogTableView.tsx        # Table layout for blog list
│   ├── ImageUploadSection.tsx   # Image upload with drag & drop
│   └── BlogFormFields.tsx       # Form inputs (title, excerpt, content, category)
└── README.md                     # This file
```

## 🎯 Component Purposes

### **page.tsx** - Main Dashboard

- Fetches all blogs from Firestore
- Switches between grid and table views
- Opens create/edit modals
- Handles blog deletion and status updates
- **State**: blogs, loading, viewMode, modals

### **CreateEditBlogModal.tsx** - Blog Editor

- Create new blogs or edit existing ones
- Firebase Storage image upload with validation
- **Three save options**:
  - **Save Draft**: Keep working privately
  - **Submit for Review** (pending): Send to admin for approval
  - **Publish Now** (admin only): Make live immediately
- **Admin Mode**: All 3 buttons | **User Mode**: Draft + Submit for Review

### **BlogStats.tsx** - Statistics Dashboard

- **5 Statistics Cards**:
  1. Total Blogs (blue) - All articles
  2. Published (green) - Live articles
  3. Pending Review (yellow) - Awaiting approval ⭐ NEW
  4. Drafts (orange) - Work in progress
  5. Total Likes (purple) - Engagement

### **BlogGridView.tsx** - Card Layout

- 3-column responsive grid
- Cover image display
- Category and status badges
- Action buttons: Edit, Delete, Publish/Submit/Unpublish

### **BlogTableView.tsx** - Table Layout

- Traditional table with sortable columns
- Compact view for reviewing many blogs
- Action buttons: Edit, Approve (pending), View, Delete

### **ImageUploadSection.tsx** - Image Upload

- Drag & drop zone
- File validation (images only, max 5MB)
- Preview with remove button
- File size display

### **BlogFormFields.tsx** - Form Inputs

- Title, Excerpt, Content, Category
- Character counters
- Admin-only author field

## 🔄 Blog Status Workflow ⭐ NEW

### Status Types

- **draft**: Author still working
- **pending**: Submitted for admin review ⭐ NEW
- **published**: Live and visible

### User Flow (Non-Admin)

1. Create blog → **draft**
2. "Submit for Review" → **pending**
3. Admin clicks "Publish" → **published**

### Admin Flow

- Can publish immediately
- Can change any status directly
- Sees all blogs regardless of status

## 🎨 Color Coding

- **Blue**: Total/General
- **Green**: Published/Success
- **Yellow**: Pending Review ⭐ NEW
- **Orange**: Draft
- **Purple**: Engagement
- **Red**: Delete/Danger

## 📊 Data Flow

```
page.tsx
  ├── Fetches blogs → Firestore
  ├── BlogStats → Calculates pending count ⭐ NEW
  ├── BlogGridView/BlogTableView → Displays with status badges
  └── CreateEditBlogModal → Saves with status field → Refreshes
```

## Who Can Access?

- ✅ **Admin Only** (Protected by `AdminLayout` → `AdminRoute`)
- ❌ Regular users cannot access
- ❌ Unauthenticated users cannot access

## Features

### Stats Dashboard (Bento Grid)

- **Total Blogs** - All articles count
- **Published** - Live articles count
- **Drafts** - Unpublished articles count
- **Total Likes** - Sum of all blog likes

### Blog Management Table

Displays ALL blogs with columns:

- Title
- Author
- Category
- Likes count
- Status (Published/Draft) - **Clickable to toggle**
- Date created
- Actions (View, Delete)

### Admin Powers

| Action              | Description                                       |
| ------------------- | ------------------------------------------------- |
| **View All**        | See both published and draft blogs                |
| **Toggle Publish**  | Click status badge to publish/unpublish           |
| **Delete Any Blog** | Remove any blog (with confirmation)               |
| **View Blog**       | Opens blog in new tab                             |
| **Create Blog**     | "New Article" button redirects to `/blogs/create` |

## Button Actions

- 👁️ **View** (Blue hover) - Opens blog in new tab
- 🗑️ **Delete** (Red hover) - Permanently deletes blog
- ✅/❌ **Status Toggle** - Switches between Published (green) and Draft (orange)

## Navigation

- AdminSidebar → **Quick Access → Blogs**
- Direct URL: `/admin/blogs`

## Permissions Required

- User must be authenticated
- User role must be `admin` in Firestore
