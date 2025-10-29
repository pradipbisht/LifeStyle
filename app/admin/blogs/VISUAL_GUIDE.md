# 📸 Visual Component Guide

## Component Tree

```
AdminBlogsPage (page.tsx)
│
├── Header Section
│   ├── Title: "Blog Management"
│   ├── View Toggle: Grid | Table
│   └── Button: "+ New Article"
│
├── Stats Section (BlogStats.tsx)
│   ├── Card 1: Total Blogs (Blue, FileText icon)
│   ├── Card 2: Published (Green, Eye icon)
│   ├── Card 3: Pending Review (Yellow, Clock icon) ⭐ NEW
│   ├── Card 4: Drafts (Orange, EyeOff icon)
│   └── Card 5: Total Likes (Purple, TrendingUp icon)
│
├── Content Section (Grid or Table View)
│   │
│   ├── BlogGridView.tsx (if viewMode === "grid")
│   │   └── For each blog:
│   │       ├── Cover Image
│   │       ├── Category Badge (Blue)
│   │       ├── Status Badge (Green/Yellow/Orange)
│   │       ├── Title
│   │       ├── Excerpt
│   │       ├── Author Info
│   │       ├── Stats (Likes, Date)
│   │       └── Action Buttons
│   │           ├── Edit (Green)
│   │           ├── Delete (Red)
│   │           └── Status Actions:
│   │               ├── If draft: "Publish" + "Submit"
│   │               ├── If pending: "Publish" (approve)
│   │               └── If published: "Unpublish"
│   │
│   └── BlogTableView.tsx (if viewMode === "table")
│       └── For each blog:
│           ├── Title column
│           ├── Author column
│           ├── Category column (Badge)
│           ├── Likes column
│           ├── Status column (Badge with icon)
│           ├── Date column
│           └── Actions column
│               ├── Edit button
│               ├── Approve button (if pending)
│               ├── View button
│               └── Delete button
│
└── Modals
    ├── CreateEditBlogModal (create mode)
    │   ├── ImageUploadSection
    │   │   ├── Drag & drop zone (empty state)
    │   │   └── OR Image preview (with remove button)
    │   │
    │   ├── BlogFormFields
    │   │   ├── Title input
    │   │   ├── Excerpt textarea (with counter)
    │   │   ├── Category dropdown
    │   │   ├── Author input (if admin)
    │   │   └── Content textarea (with counter)
    │   │
    │   ├── Status Info Box (Blue background)
    │   │
    │   └── Action Buttons
    │       ├── If Admin:
    │       │   ├── "Save Draft" (outline)
    │       │   ├── "Mark Pending" (yellow)
    │       │   └── "Publish Now" (green)
    │       └── If User:
    │           ├── "Save Draft" (outline)
    │           └── "Submit for Review" (yellow)
    │
    └── CreateEditBlogModal (edit mode)
        └── Same structure as create mode
            └── Pre-filled with blog data
```

---

## Button States by Role

### Admin Creating New Blog

```
┌──────────────┬────────────────┬──────────────┬────────┐
│  Save Draft  │ Mark Pending   │ Publish Now  │ Cancel │
│  (outline)   │  (yellow bg)   │  (green bg)  │        │
└──────────────┴────────────────┴──────────────┴────────┘
```

### User Creating New Blog

```
┌──────────────┬──────────────────────┬────────┐
│  Save Draft  │ Submit for Review    │ Cancel │
│  (outline)   │    (yellow bg)       │        │
└──────────────┴──────────────────────┴────────┘
```

---

## Status Badge Colors

### Draft

```
┌──────────┐
│  Draft   │  ← Orange background (#fed7aa)
│          │     Brown text (#9a3412)
│  EyeOff  │     Icon: EyeOff
└──────────┘
```

### Pending Review ⭐ NEW

```
┌────────────────┐
│ Pending Review │  ← Yellow background (#fef3c7)
│                │     Brown text (#92400e)
│     Clock      │     Icon: Clock
└────────────────┘
```

### Published

```
┌───────────┐
│ Published │  ← Green background (#dcfce7)
│           │     Dark green text (#166534)
│  Eye/✓    │     Icon: Eye or CheckCircle
└───────────┘
```

---

## Grid View Layout

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Blog Card 1   │   Blog Card 2   │   Blog Card 3   │
│  ┌───────────┐  │  ┌───────────┐  │  ┌───────────┐  │
│  │   Image   │  │  │   Image   │  │  │   Image   │  │
│  └───────────┘  │  └───────────┘  │  └───────────┘  │
│  Category Status│  Category Status│  Category Status│
│  Title          │  Title          │  Title          │
│  Excerpt        │  Excerpt        │  Excerpt        │
│  👤 Author      │  👤 Author      │  👤 Author      │
│  ❤️ 12  📅 Date │  ❤️ 5   📅 Date │  ❤️ 8   📅 Date │
│  ┌──┬──┬──────┐ │  ┌──┬──┬──────┐ │  ┌──┬──┬──────┐ │
│  │✏️│🗑│Submit│ │  │✏️│🗑│Submit│ │  │✏️│🗑│Publish│ │
│  └──┴──┴──────┘ │  └──┴──┴──────┘ │  └──┴──┴──────┘ │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## Table View Layout

```
┌──────────────┬────────┬──────────┬──────┬───────────┬──────────┬────────────┐
│ Title        │ Author │ Category │ Likes│  Status   │   Date   │  Actions   │
├──────────────┼────────┼──────────┼──────┼───────────┼──────────┼────────────┤
│ How to...    │ John   │ Health   │  12  │ ⏰Pending │ Oct 28   │ ✏️ ✓ 👁 🗑  │
│ Top 10...    │ Jane   │ Fitness  │   5  │ 👁Publish │ Oct 27   │ ✏️ 👁 🗑    │
│ Guide to...  │ Bob    │ Nutrition│   8  │ 🚫Draft   │ Oct 26   │ ✏️ 🗑       │
└──────────────┴────────┴──────────┴──────┴───────────┴──────────┴────────────┘
```

---

## Stat Cards Layout

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Total Blogs  │  Published   │   Pending    │    Drafts    │ Total Likes  │
│     📄       │      👁       │      ⏰      │      🚫      │      📈      │
│              │              │              │              │              │
│     25       │      15      │       3      │       7      │     142      │
│ All articles │ Live articles│ Awaiting...  │ Work in...   │  All time    │
│              │              │              │              │              │
│   (Blue)     │   (Green)    │   (Yellow)   │  (Orange)    │  (Purple)    │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## Image Upload States

### Empty State (No Image)

```
┌─────────────────────────────────────────┐
│                                         │
│              📤 Upload Icon             │
│                                         │
│      Click to upload or drag and drop   │
│          PNG, JPG, WEBP (MAX. 5MB)      │
│                                         │
└─────────────────────────────────────────┘
```

### Preview State (Image Selected)

```
┌─────────────────────────────────────────┐
│                                    [❌] │ ← Remove button
│                                         │
│         [Blog Cover Image Preview]      │
│                                         │
│  📁 2.4 MB                              │ ← File size badge
└─────────────────────────────────────────┘
✓ New image selected: sunset.jpg
```

---

## Workflow Visual

### User Journey

```
User creates blog
       │
       ▼
   Save Draft ──┐
       │        │
       ▼        │
Keep editing ───┘
       │
       ▼
Submit for Review
       │
       ▼
   [PENDING] ──────► Admin Dashboard
                            │
                            ▼
                      Admin reviews
                            │
                            ▼
                        Approve
                            │
                            ▼
                      [PUBLISHED]
                            │
                            ▼
                    Public can see
```

### Admin Journey

```
Admin creates blog
       │
       ├──► Save Draft ──► Keep editing
       │
       ├──► Mark Pending ──► Review later
       │
       └──► Publish Now ──► [PUBLISHED] ──► Public sees immediately
```

---

## Responsive Behavior

### Desktop (>1024px)

- Grid: 3 columns
- Stats: 5 cards in a row
- Table: All columns visible

### Tablet (768px - 1024px)

- Grid: 2 columns
- Stats: 3 cards + 2 cards on next row
- Table: Horizontal scroll

### Mobile (<768px)

- Grid: 1 column (stacked)
- Stats: 1 card per row (stacked)
- Table: Switch to grid view recommended

---

## Icon Legend

- 📄 FileText: Total blogs
- 👁 Eye: Published, view
- ⏰ Clock: Pending review
- 🚫 EyeOff: Draft
- 📈 TrendingUp: Likes
- ✏️ Edit: Edit blog
- 🗑 Trash2: Delete blog
- ✓ CheckCircle: Approve/Published
- 👤 User: Author
- 📅 Calendar: Date
- ❤️ Heart: Likes count
- 📤 Upload: Image upload
- ❌ X: Remove
