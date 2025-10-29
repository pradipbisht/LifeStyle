# 📦 Component Index

Quick reference for all blog management components and their locations.

## Main Files

| File                      | Lines | Purpose                                         |
| ------------------------- | ----- | ----------------------------------------------- |
| `page.tsx`                | ~150  | Main admin dashboard - orchestrates everything  |
| `CreateEditBlogModal.tsx` | ~200  | Blog creation/editing modal with save workflows |

## Components Directory (`components/`)

| Component                | Lines | Purpose              | Key Features                                            |
| ------------------------ | ----- | -------------------- | ------------------------------------------------------- |
| `BlogStats.tsx`          | ~120  | Statistics dashboard | 5 stat cards (Total, Published, Pending, Drafts, Likes) |
| `BlogGridView.tsx`       | ~150  | Grid card layout     | 3-column responsive grid with action buttons            |
| `BlogTableView.tsx`      | ~120  | Table list layout    | Sortable columns, compact view for bulk management      |
| `ImageUploadSection.tsx` | ~60   | Image upload UI      | Drag & drop, preview, validation (5MB max)              |
| `BlogFormFields.tsx`     | ~80   | Form input fields    | Title, Excerpt, Content, Category, Author               |

## Documentation Files

| File                  | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `README.md`           | Component structure overview             |
| `REFACTOR_SUMMARY.md` | What changed, benefits, migration guide  |
| `VISUAL_GUIDE.md`     | Visual layouts, button states, workflows |
| `COMPONENT_INDEX.md`  | This file - quick reference              |

---

## Component Props Reference

### BlogStats

```typescript
interface BlogStatsProps {
  blogs: Blog[]
}
```

### BlogGridView

```typescript
interface BlogGridViewProps {
  blogs: Blog[]
  loading: boolean
  onEdit: (blog: Blog) => void
  onDelete: (blogId: string, title: string) => void
  onUpdateStatus: (blogId: string, newStatus: "draft" | "pending" | "published") => void
  formatDate: (timestamp: any) => string
}
```

### BlogTableView

```typescript
interface BlogTableViewProps {
  // Same as BlogGridView
  blogs: Blog[]
  loading: boolean
  onEdit: (blog: Blog) => void
  onDelete: (blogId: string, title: string) => void
  onUpdateStatus: (blogId: string, newStatus: "draft" | "pending" | "published") => void
  formatDate: (timestamp: any) => string
}
```

### ImageUploadSection

```typescript
interface ImageUploadSectionProps {
  imagePreview: string
  imageFile: File | null
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
}
```

### BlogFormFields

```typescript
interface BlogFormFieldsProps {
  formData: {
    title: string
    excerpt: string
    content: string
    category: string
    author: string
  }
  onFormChange: (field: string, value: string) => void
  adminMode?: boolean
}
```

### CreateEditBlogModal

```typescript
interface CreateEditBlogModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  blog?: Blog | null
  adminMode?: boolean
  userProfile?: { username: string; uid?: string } | null
}
```

---

## File Paths

```
app/
└── admin/
    └── blogs/
        ├── page.tsx
        ├── CreateEditBlogModal.tsx
        ├── README.md
        ├── REFACTOR_SUMMARY.md
        ├── VISUAL_GUIDE.md
        ├── COMPONENT_INDEX.md
        └── components/
            ├── BlogStats.tsx
            ├── BlogGridView.tsx
            ├── BlogTableView.tsx
            ├── ImageUploadSection.tsx
            └── BlogFormFields.tsx
```

---

## Import Examples

### In page.tsx

```typescript
import BlogStats from "./components/BlogStats"
import BlogGridView from "./components/BlogGridView"
import BlogTableView from "./components/BlogTableView"
import CreateEditBlogModal from "./CreateEditBlogModal"
```

### In CreateEditBlogModal.tsx

```typescript
import ImageUploadSection from "./components/ImageUploadSection"
import BlogFormFields from "./components/BlogFormFields"
```

### Anywhere else in the app

```typescript
import { Blog } from "@/types/blog"
```

---

## Component Dependencies

### BlogStats

- **Depends on**: Blog type
- **External deps**: shadcn/ui Card, lucide-react icons
- **Firebase**: None (just data processing)

### BlogGridView

- **Depends on**: Blog type
- **External deps**: shadcn/ui Card, Badge, Button, lucide-react icons
- **Firebase**: None (parent handles data)

### BlogTableView

- **Depends on**: Blog type, Next.js Link
- **External deps**: shadcn/ui Card, Badge, Button, lucide-react icons
- **Firebase**: None (parent handles data)

### ImageUploadSection

- **Depends on**: None
- **External deps**: shadcn/ui Label, lucide-react icons
- **Firebase**: None (just UI)

### BlogFormFields

- **Depends on**: None
- **External deps**: shadcn/ui Input, Textarea, Label
- **Firebase**: None (just UI)

### CreateEditBlogModal

- **Depends on**: Blog type, ImageUploadSection, BlogFormFields
- **External deps**: shadcn/ui Dialog, Button, Label
- **Firebase**: Firestore (addDoc, updateDoc), Storage (uploadBytes, getDownloadURL)

### page.tsx

- **Depends on**: All components above, Blog type, AuthContext, AdminLayout
- **External deps**: shadcn/ui Button, lucide-react icons, Next.js font
- **Firebase**: Firestore (getDocs, deleteDoc, updateDoc)

---

## Quick Navigation

**Want to change...**

- Stats display? → `components/BlogStats.tsx`
- Grid layout? → `components/BlogGridView.tsx`
- Table layout? → `components/BlogTableView.tsx`
- Image upload UI? → `components/ImageUploadSection.tsx`
- Form fields? → `components/BlogFormFields.tsx`
- Save logic? → `CreateEditBlogModal.tsx`
- Data fetching? → `page.tsx`
- Blog type? → `types/blog.ts`

**Need help with...**

- Component structure? → `README.md`
- What changed? → `REFACTOR_SUMMARY.md`
- Visual layouts? → `VISUAL_GUIDE.md`
- File locations? → `COMPONENT_INDEX.md` (this file)

---

## Testing Checklist

- [ ] Create new blog as admin (all 3 save options)
- [ ] Create new blog as user (draft + submit)
- [ ] Edit existing blog
- [ ] Delete blog
- [ ] Toggle between grid and table views
- [ ] Upload image (drag & drop)
- [ ] Remove uploaded image
- [ ] Validate image size limit (>5MB)
- [ ] Check all stat cards
- [ ] Approve pending blog
- [ ] Publish draft blog
- [ ] Unpublish published blog

---

## Performance Tips

- **Pagination**: If >100 blogs, add pagination to page.tsx
- **Lazy Loading**: Consider lazy loading BlogGridView/BlogTableView
- **Image Optimization**: Add image compression in ImageUploadSection
- **Memoization**: Wrap BlogStats in React.memo if re-rendering often
- **Virtualization**: Use react-window for table with 1000+ rows

---

Last updated: October 28, 2025
