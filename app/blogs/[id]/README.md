# 📖 Single Blog View

## Purpose

This is the **INDIVIDUAL BLOG DETAIL PAGE** showing full article content.

## Location

`app/blogs/[id]/page.tsx`

## Who Can Access?

- ✅ **Everyone** (Public) - Read any published blog
- ✅ **Authenticated Users** - Read + like/dislike blogs

## Dynamic Route

Uses Next.js dynamic routing: `/blogs/[id]`

- Example: `/blogs/abc123` shows blog with ID "abc123"

## Features

- Full blog content display
- Cover image (if available)
- Author information
- Publication date
- Category badge
- **Like/Dislike Buttons** (requires authentication)
  - Increments likes/dislikes in Firestore
  - Shows current count
  - Disabled for non-authenticated users
- Back to blog list button

## User Interactions

| Action       | Public               | Authenticated |
| ------------ | -------------------- | ------------- |
| Read blog    | ✅                   | ✅            |
| Like blog    | ❌ (prompt to login) | ✅            |
| Dislike blog | ❌ (prompt to login) | ✅            |

## Navigation

- Accessible from blog list cards
- URL: `/blogs/{blogId}`
