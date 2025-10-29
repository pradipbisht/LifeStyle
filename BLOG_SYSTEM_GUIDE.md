# 📚 Blog System Overview

## Quick Reference Guide

### 🗂️ Folder Structure

```
app/
├── blogs/                          👉 PUBLIC BLOG AREA
│   ├── page.tsx                   → Blog list (everyone can view)
│   ├── README.md                  → Documentation
│   ├── create/                    👉 AUTHENTICATED USERS ONLY
│   │   ├── page.tsx              → Create new blog
│   │   └── README.md             → Documentation
│   └── [id]/                      👉 PUBLIC BLOG DETAIL
│       ├── page.tsx              → Single blog view
│       └── README.md             → Documentation
│
├── admin/                          👉 ADMIN AREA ONLY
│   └── blogs/
│       ├── page.tsx              → Admin blog management
│       └── README.md             → Documentation
│
└── types/
    └── blog.ts                    → TypeScript interfaces
```

---

## 🎯 Quick Navigation

### For Regular Users:

- **View Blogs**: Visit `/blogs` (navbar → Content & Tools → Blog & Articles)
- **Write Article**: Login first, then `/blogs/create` or click "Write Article" button
- **Read Blog**: Click any blog card to view full content at `/blogs/{id}`

### For Admins:

- **Manage All Blogs**: AdminSidebar → Quick Access → Blogs → `/admin/blogs`
- **View Stats**: See dashboard with total/published/drafts/likes
- **Control Publishing**: Click status badges to publish/unpublish
- **Delete Blogs**: Use delete button (red hover)

---

## 🔒 Permission Matrix

| Feature              | Public | Authenticated        | Admin |
| -------------------- | ------ | -------------------- | ----- |
| View published blogs | ✅     | ✅                   | ✅    |
| View draft blogs     | ❌     | ❌                   | ✅    |
| Create blog          | ❌     | ✅                   | ✅    |
| Like/Dislike blog    | ❌     | ✅                   | ✅    |
| Edit own blog        | ❌     | ⚠️ (not implemented) | ✅    |
| Delete own blog      | ❌     | ⚠️ (not implemented) | ✅    |
| Delete any blog      | ❌     | ❌                   | ✅    |
| Publish/Unpublish    | ❌     | ❌                   | ✅    |

---

## 📄 Page Descriptions

### 1️⃣ `/blogs` - Public Blog List

**File**: `app/blogs/page.tsx`

- **Who**: Everyone (public access)
- **Purpose**: Browse all published blogs
- **Features**: Grid cards, search, category filters, like counts

### 2️⃣ `/blogs/create` - Create Blog

**File**: `app/blogs/create/page.tsx`

- **Who**: Authenticated users only
- **Purpose**: Write and publish new articles
- **Features**: Rich form, publish/draft toggle, category selector

### 3️⃣ `/blogs/[id]` - Single Blog View

**File**: `app/blogs/[id]/page.tsx`

- **Who**: Everyone (public access)
- **Purpose**: Read full blog content
- **Features**: Like/dislike buttons, author info, comments (future)

### 4️⃣ `/admin/blogs` - Admin Management

**File**: `app/admin/blogs/page.tsx`

- **Who**: Admins only
- **Purpose**: Manage ALL blogs (published + drafts)
- **Features**: Stats dashboard, publish toggle, delete, view all

---

## 🗄️ Firestore Collections

### `blogs` Collection

```javascript
{
  id: "auto-generated",
  title: "Blog Title",
  content: "Full article content...",
  excerpt: "Brief description",
  author: "username",
  authorId: "user-uid",
  category: "Health & Lifestyle",
  likes: 0,
  dislikes: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isPublished: true/false,
  coverImage: "https://..." // optional
}
```

---

## 🚀 Common Tasks

### How to create a blog?

1. Login to your account
2. Go to `/blogs` or navbar → Content & Tools → Blog & Articles
3. Click "Write Article" button
4. Fill in title, excerpt, content, category
5. Check "Publish immediately" or leave unchecked for draft
6. Click "Publish Article" or "Save Draft"

### How to manage blogs as admin?

1. Login as admin
2. Go to AdminSidebar → Quick Access → Blogs
3. View stats and all blogs in table
4. Click status badge to toggle publish/unpublish
5. Click eye icon to view blog
6. Click delete icon to remove blog

### How to like a blog?

1. Login to your account
2. Visit any blog detail page `/blogs/{id}`
3. Scroll to bottom
4. Click "Like" or "Dislike" button

---

## 📍 File Locations

| Component          | Path                         |
| ------------------ | ---------------------------- |
| Public blog list   | `app/blogs/page.tsx`         |
| Create blog        | `app/blogs/create/page.tsx`  |
| Single blog view   | `app/blogs/[id]/page.tsx`    |
| Admin management   | `app/admin/blogs/page.tsx`   |
| Blog types         | `types/blog.ts`              |
| Navbar link        | `app/ux/navbar/NavMenu.tsx`  |
| Admin sidebar link | `app/admin/AdminSidebar.tsx` |

---

## 🎨 UI Components Used

- **shadcn/ui**: Card, Button, Badge, Input, Textarea, Label
- **Lucide Icons**: FileText, Plus, Eye, EyeOff, Heart, ThumbsDown, Trash2
- **Fonts**: Playfair Display (headings)
- **Layout**: Bento grid stats, responsive table, gradient cards

---

## 🔜 Future Enhancements

- [ ] Comments system (authenticated users can comment)
- [ ] Rich text editor (WYSIWYG instead of textarea)
- [ ] Image upload (instead of URL input)
- [ ] Edit blog functionality
- [ ] Blog categories filter
- [ ] Search functionality
- [ ] Pagination (load more blogs)
- [ ] User can edit/delete own blogs
- [ ] Draft auto-save
- [ ] Blog views counter

---

## ⚠️ Important Notes

1. **Published vs Draft**: Only published blogs appear on public list
2. **Authentication**: Must be logged in to create, like, or dislike
3. **Admin Power**: Admins can see and manage ALL blogs
4. **Firestore Rules**: Remember to set security rules in Firebase console
5. **Real-time**: Likes/dislikes update immediately with Firestore increment

---

Need help? Check the README.md file in each blogs folder for detailed documentation!
