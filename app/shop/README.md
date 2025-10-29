# Shop / Marketplace

A full-featured e-commerce marketplace supporting both affiliate and direct sales.

## Features

### Customer Features

- Browse products across 5 categories (Health, Skincare, Haircare, Pets, Parenting)
- Advanced filtering (price, brand, rating, stock)
- Product search
- Multiple sort options
- Product detail pages with image galleries
- Shopping cart functionality
- Affiliate link redirects for external products
- Mobile responsive design

### Admin Features

- Product management (add, edit, delete)
- Image upload to Firebase Storage
- Inventory tracking
- Sales analytics with graphs
- Category-based organization
- Product status controls (active/inactive, featured, trending)
- Bulk operations support

## Structure

```
shop/
├── page.tsx                    # Main shop page
├── [productId]/
│   └── page.tsx               # Product detail page
├── cart/
│   └── page.tsx               # Shopping cart
└── components/
    ├── ShopHero.tsx           # Hero section with search
    ├── CategoryTabs.tsx       # Category navigation
    ├── ProductCard.tsx        # Product display card
    ├── ProductGrid.tsx        # Grid layout for products
    └── FilterSidebar.tsx      # Filtering controls
```

## Database Collections

### Products

- Basic info (name, brand, description)
- Pricing (price, originalPrice, currency)
- Images (Firebase Storage URLs)
- Category classification
- Stock management
- Affiliate settings
- SEO metadata
- Analytics counters

### Cart

- User-specific cart items
- Quantity tracking
- Auto-sync across devices

### Orders

- Order history
- Customer details
- Status tracking
- Payment information

## How It Works

1. **Product Display**: Fetch active products from Firestore
2. **Filtering**: Client-side filtering for instant results
3. **Cart**: Store cart data in Firestore per user
4. **Checkout**:
   - Affiliate products → Redirect to external URL
   - Direct products → Payment gateway integration
5. **Admin**: Full CRUD operations with Firebase Storage for images

## Security

- Products: Read by all, write by admins only
- Cart: Read/write by owner only
- Orders: Read by owner/admin, create by owner, update by admin

## Adding Products

1. Navigate to Admin > Products
2. Click "Add Product"
3. Fill in product details
4. Upload images to Firebase Storage
5. Set pricing and inventory
6. Choose sale type (affiliate/direct)
7. Publish

## Categories

Products are organized into categories matching the site structure:

- Health & Lifestyle
- Skincare
- Haircare
- Pet Care
- Baby & Kids

Each category has relevant subcategories for better organization.
