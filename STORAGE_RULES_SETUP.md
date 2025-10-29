# Firebase Storage Rules Setup

## Current Issue

Product images cannot be uploaded due to storage permission error:

```
Firebase Storage: User does not have permission to access 'products/xxx.jpg'. (storage/unauthorized)
```

## Quick Fix - Update Firebase Storage Rules

### Step 1: Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **e-com-36739**
3. Navigate to **Storage** in the left sidebar
4. Click on the **Rules** tab

### Step 2: Choose Your Rules

**Option A - For Development/Testing (⚡ RECOMMENDED FOR NOW):**

```
File: storage.rules.dev
Access: Any authenticated user can upload images
Benefit: Quick testing without role restrictions
```

**Option B - For Production (🔒 Use before deploying):**

```
File: storage.rules
Access: Only users with role='admin' can upload
Benefit: Secure, production-ready rules
```

### Step 3: Apply the Rules

1. Open one of the rules files (`storage.rules.dev` or `storage.rules`)
2. Copy ALL the content (Ctrl+A, Ctrl+C)
3. Go back to Firebase Console → Storage → Rules tab
4. Select all existing rules and delete them
5. Paste the new rules
6. Click **Publish** button (top-right)
7. Wait for "Rules published successfully" message

### Step 4: Test Product Upload

1. Go back to your app: http://localhost:3000/admin/products/new
2. Fill in product details
3. Upload an image
4. Click "Add Product"
5. Should work without errors! ✅

---

## Troubleshooting

### Still Getting Permission Error?

1. **Check if you're logged in:**

   - Look at top-right corner, should show your email
   - If not, click "Login" and sign in

2. **Clear browser cache:**

   - Press Ctrl+Shift+Delete
   - Clear "Cached images and files"
   - Refresh page (F5)

3. **Verify rules are published:**

   - Go to Firebase Console → Storage → Rules
   - Check "Last updated" timestamp should be recent
   - If old, click "Publish" again

4. **For Production Rules (storage.rules):**
   - Go to Firebase Console → Firestore Database
   - Find `users` collection
   - Find your user document (pradipbisht007@gmail.com)
   - Check if field `role` exists and equals `"admin"`
   - If not, add field: `role` = `admin` (string type)

### Image Upload Best Practices

- **Supported formats:** JPG, PNG, WebP, GIF
- **Recommended size:** Under 5MB per image
- **Max images:** 5 per product
- **Naming:** Automatically handled (timestamp + index + original name)

---

## Alternative: Using Firebase CLI

If you prefer command-line deployment:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init storage

# Deploy development rules
firebase deploy --only storage

# Later, for production, update firebase.json to point to storage.rules
# Then deploy again
firebase deploy --only storage
```

---

## Files Created

1. **storage.rules** - Production rules (admin-only uploads)
2. **storage.rules.dev** - Development rules (authenticated users can upload)
3. **STORAGE_RULES_SETUP.md** - This guide

## Current Storage Structure

```
e-com-36739.appspot.com/
├── products/
│   └── {timestamp}_{index}_{filename}.jpg
├── blogs/
│   └── {timestamp}_{index}_{filename}.jpg
└── profiles/
    └── {userId}/
        └── {filename}.jpg
```

## Security Notes

- **Development rules** are permissive for quick testing
- **Production rules** verify admin role via Firestore lookup
- All files are publicly readable (good for e-commerce)
- Write access is restricted based on authentication and role
- Switch to production rules before deploying to live environment

---

## Quick Reference

**Your Firebase Project:** e-com-36739  
**Storage Bucket:** e-com-36739.appspot.com  
**Console URL:** https://console.firebase.google.com/project/e-com-36739/storage

**Need help?** Check the troubleshooting section above or contact support.
