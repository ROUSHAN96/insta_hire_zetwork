# 🛒 ShopZet — Production-Grade E-Commerce Cart & Checkout System

A production-grade, full-featured e-commerce shopping cart and checkout web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS v4**, and **shadcn/ui**.

---

## 🌟 Features

1. **Product Catalog & Details**
   - Responsive product grid with category pills and debounced real-time search.
   - Dynamic product detail pages (`/products/[slug]`) generated at build-time (SSG) with `generateStaticParams`.
   - Star ratings, stock inventory indicators, and quick-add controls with optimistic feedback.

2. **Cart Management**
   - Global reactive cart state via React Context + custom `useCart` facade hook.
   - Add to cart, update quantity (with stock and max-limit boundaries), remove items, and clear cart.
   - Persistent across page reloads and browser sessions using `localStorage`.
   - Real-time cart badge in header reflecting total item count.

3. **Dynamic Cart Calculations**
   - Dynamic line-item subtotal and overall order calculation stored in integer cents to eliminate floating-point rounding errors.
   - Automatic free shipping threshold evaluation (e.g. Free shipping on orders over ₹999).

4. **Type-Safe Checkout Form**
   - Comprehensive two-step checkout form covering Contact Information and Shipping Address.
   - End-to-end schema validation powered by **Zod** with real-time, inline field errors.
   - Order summary sidebar displaying items, unit costs, shipping, and grand total.

5. **Order Confirmation & Summary**
   - Dedicated order confirmation page (`/order-confirmation/[id]`) with celebratory state, full receipt breakdown, shipping address, and unique order ID.

6. **Out of Scope**
   - Payment handling (payment gateway integration).

---

## 🏛️ Architectural Patterns & SOLID Principles

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                     │
│  - App Router Pages (Server Components by default)         │
│  - Interactive Client Components ('use client' boundaries) │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│       State Management      │ │          Data Layer         │
│  - CartContext + Provider   │ │  - ProductRepository       │
│  - useCart (Facade Hook)    │ │  - OrderRepository         │
│  - LocalStorage Strategy    │ │  - In-Memory / JSON DB     │
└──────────────┬──────────────┘ └──────────────┬──────────────┘
               │                               │
┌──────────────▼───────────────────────────────▼──────────────┐
│                    Cross-Cutting & Domain                   │
│  - Zod Schemas (Product, Order, Checkout)                   │
│  - Type-safe Formatters & Constants (Cents-based currency)  │
└─────────────────────────────────────────────────────────────┘
```

| Pattern / Principle | Implementation in ShopZet |
|---|---|
| **Single Responsibility (SRP)** | Data repositories handle storage, contexts handle state synchronization, components render UI, and formatters handle data presentation. |
| **Open/Closed (OCP)** | The `ProductRepository` and `OrderRepository` abstractions allow swapping in-memory data with PostgreSQL/Prisma or MongoDB without touching UI components. |
| **Liskov Substitution (LSP)** | Consistent domain interfaces (`Product`, `CartItem`, `Order`) ensure seamless composition across layers. |
| **Interface Segregation (ISP)** | Clean, focused types for `CustomerInfo`, `ShippingAddress`, and `CartItem` rather than bloated all-in-one objects. |
| **Dependency Inversion (DIP)** | Components and API routes depend on repository abstractions rather than direct file I/O or concrete storage mechanisms. |
| **Repository Pattern** | `productRepository` and `orderRepository` encapsulate all data querying and persistence. |
| **Facade Pattern** | `useCart()` hook provides a simplified, ergonomic API concealing internal storage synchronization and reducer logic. |
| **DRY Principle** | Reusable price formatting (`formatPrice`), date formatting (`formatDate`), debouncing (`useDebounce`), and shared Zod schemas between client and API routes. |

---

## 📁 Directory Structure

```
src/
├── app/
│   ├── api/
│   │   ├── orders/
│   │   │   ├── [id]/route.ts       # GET order by ID
│   │   │   └── route.ts            # POST create order
│   │   └── products/
│   │       ├── [id]/route.ts       # GET product by ID
│   │       └── route.ts            # GET all products (filter/search)
│   ├── cart/
│   │   └── page.tsx                # Shopping cart page
│   ├── checkout/
│   │   └── page.tsx                # Checkout form & order review
│   ├── order-confirmation/
│   │   └── [id]/
│   │       ├── loading.tsx         # Confirmation skeleton loader
│   │       └── page.tsx            # Order confirmation receipt
│   ├── products/
│   │   └── [slug]/
│   │       ├── loading.tsx         # Product detail skeleton loader
│   │       └── page.tsx            # SSG product detail page
│   ├── globals.css                 # Tailwind v4 styles & theme tokens
│   ├── layout.tsx                  # Root layout (Header, Providers, Footer)
│   ├── not-found.tsx               # Custom 404 page
│   └── page.tsx                    # Product catalog & home page
├── components/
│   ├── cart/
│   │   ├── cart-icon.tsx           # Reactive cart header button + badge
│   │   ├── cart-item-row.tsx       # Individual cart line item with controls
│   │   └── cart-summary.tsx        # Subtotal, shipping threshold & CTA
│   ├── checkout/
│   │   ├── checkout-form.tsx       # Zod-validated customer & shipping form
│   │   └── order-summary-card.tsx  # Checkout sidebar summary
│   ├── common/
│   │   ├── footer.tsx              # Store footer
│   │   └── header.tsx              # Sticky header with navigation & cart
│   ├── feedback/
│   │   ├── empty-state.tsx         # Empty state widget
│   │   └── loading-spinner.tsx     # Animated spinner
│   ├── product/
│   │   ├── add-to-cart-button.tsx  # Quantity bounded add-to-cart button
│   │   ├── category-filter.tsx     # Horizontal category filter pills
│   │   ├── product-card.tsx        # Product card with image, rating, badge
│   │   ├── product-listing.tsx     # Client filtering & search controller
│   │   └── search-bar.tsx          # Debounced search input
│   └── ui/                         # shadcn/ui design primitives
├── config/
│   ├── env.ts                      # Validated environment variables
│   └── site.ts                     # Store metadata & navigation config
├── data/
│   └── products.json               # 12 sample products across 4 categories
├── hooks/
│   ├── use-cart.ts                 # Facade hook for cart operations
│   ├── use-debounce.ts             # Debounce utility hook
│   ├── use-local-storage.ts        # Persistent state hook
│   └── use-media-query.ts          # Responsive breakpoint hook
├── lib/
│   ├── constants.ts                # Currency, shipping costs, limits
│   ├── fetcher.ts                  # Type-safe fetch wrapper with FetchError
│   ├── format.ts                   # Price formatter (cents -> currency)
│   └── utils.ts                    # Class name merge utility (cn)
├── providers/
│   ├── cart-provider.tsx           # React Context for cart state & storage
│   ├── index.tsx                   # Composed providers wrapper
│   └── query-provider.tsx          # TanStack React Query provider
├── repositories/
│   ├── order.repository.ts         # In-memory order CRUD repository
│   └── product.repository.ts       # Product querying repository
└── types/
    ├── cart.ts                     # CartItem & CartState types
    ├── index.ts                    # Re-exports & generic API response types
    ├── order.ts                    # Order, Customer, Shipping Zod schemas
    └── product.ts                  # Product interface & Zod validation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20+`
- **pnpm**: `v10+` (or `npm`, `yarn`, `bun`)

### Installation
```bash
# 1. Clone the repository
git clone <repository-url>
cd insta_hire_zetwork

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Run Development Server
```bash
pnpm dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing & Quality Verification

| Command | Description |
|---|---|
| `pnpm typecheck` | Run strict TypeScript compiler checks (`tsc --noEmit`) |
| `pnpm lint` | Run ESLint across entire codebase |
| `pnpm test` | Run unit & integration tests with Vitest |
| `pnpm build` | Create production-ready Next.js build |
| `pnpm start` | Run production server locally |

---

## 🔄 User Journey & Test Flow

1. **Browse Catalog**: Open `/` to view 12 sample products across Electronics, Clothing, Books, and Home & Kitchen.
2. **Search & Filter**: Click category pills (e.g., *Electronics*) or type a search keyword (e.g., *"keyboard"*) to observe instant debounced filtering.
3. **Product Details**: Click on any product card to visit `/products/[slug]`. Verify full description, stock level, rating, and responsive image.
4. **Add to Cart**: Click "Add to Cart" or use the quantity incrementor (`+`/`-`). Observe the header cart badge updating in real-time.
5. **Manage Cart**: Navigate to `/cart`. Modify item quantities, remove line items with the trash icon, or clear the entire cart. Verify dynamic subtotal and shipping calculations (₹999+ orders receive free shipping).
6. **Checkout**: Click "Proceed to Checkout" to navigate to `/checkout`.
7. **Form Validation**: Click "Place Order" with empty inputs to see Zod validation errors trigger on required fields (email format, minimum lengths, zip code).
8. **Place Order**: Complete the form with valid details and submit. The cart will clear and redirect to `/order-confirmation/[orderId]`.
9. **Receipt Verification**: Confirm all ordered items, quantities, pricing breakdown, order ID, and shipping address are correctly displayed.

---

## 🚢 Deployment

The project is configured with `vercel.json` for deployment on **Vercel**:

```bash
# Deploy with Vercel CLI
vercel --prod
```

Or connect the GitHub repository to the [Vercel Dashboard](https://vercel.com/new).
