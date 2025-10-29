# ✍️ Blog Creation Page

## Purpose

This is the **BLOG CREATION FORM** for authenticated users to write new articles.

## Location

`app/blogs/create/page.tsx`

## Who Can Access?

- ✅ **Authenticated Users Only** (Protected by `ProtectedRoute`)
- ❌ Public users cannot access

## Features

- Rich form with title, excerpt, content textarea
- Category dropdown selector
- Cover image URL input (optional)
- Publish/Draft toggle checkbox
- Auto-saves author info from authenticated user
- Redirects to `/blogs` after successful creation

## Form Fields

- Title (required)
- Excerpt (required)
- Category (required) - Health & Lifestyle, Skincare, Haircare, etc.
- Cover Image URL (optional)
- Content (required) - Main article text
- Publish toggle - Publish immediately or save as draft

## Firestore Structure

```
blogs/{blogId}
  - title: string
  - content: string
  - excerpt: string
  - author: string (from userProfile.username)
  - authorId: string (from user.uid)
  - category: string
  - likes: 0
  - dislikes: 0
  - createdAt: timestamp
  - updatedAt: timestamp
  - isPublished: boolean
  - coverImage?: string
```
