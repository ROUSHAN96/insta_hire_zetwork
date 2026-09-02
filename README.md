# 🛒 ShopZet — Production-Grade E-Commerce Cart & Checkout System

A production-grade, full-featured e-commerce shopping cart and checkout web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS v4**, **shadcn/ui**, and backed by **PostgreSQL** with **Prisma ORM**.

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
│  - LocalStorage Strategy    │ │  - Prisma ORM + PostgreSQL │
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
| **Single Responsibility (SRP)** | Data repositories handle database queries via Prisma, contexts handle state synchronization, components render UI, and formatters handle data presentation. |
| **Open/Closed (OCP)** | The `ProductRepository` and `OrderRepository` abstractions decouple database queries from business and presentation logic. |
| **Liskov Substitution (LSP)** | Consistent domain interfaces (`Product`, `CartItem`, `Order`) ensure seamless composition across layers. |
| **Interface Segregation (ISP)** | Clean, focused types for `CustomerInfo`, `ShippingAddress`, and `CartItem` rather than bloated all-in-one objects. |
| **Dependency Inversion (DIP)** | Components and API routes depend on repository abstractions rather than direct database queries or raw SQL. |
| **Repository Pattern** | `productRepository` and `orderRepository` encapsulate all database querying, filtering, and persistence via Prisma ORM. |
| **Facade Pattern** | `useCart()` hook provides a simplified, ergonomic API concealing internal storage synchronization and reducer logic. |
| **DRY Principle** | Reusable price formatting (`formatPrice`), date formatting (`formatDate`), debouncing (`useDebounce`), and shared Zod schemas between client and API routes. |

---

## 📁 Directory Structure

```
prisma/
├── migrations/                     # Prisma SQL migration history
├── schema.prisma                   # Database models (Product, Order, OrderItem)
└── seed.ts                         # PostgreSQL seed script (upsert from JSON)
src/
├── app/
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts            # API health check endpoint
│   │   ├── orders/
│   │   │   ├── [id]/route.ts       # GET order by ID
│   │   │   └── route.ts            # POST create order & order items
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
│   └── products.json               # Initial sample products catalog
├── hooks/
│   ├── use-cart.ts                 # Facade hook for cart operations
│   ├── use-debounce.ts             # Debounce utility hook
│   ├── use-local-storage.ts        # Persistent state hook
│   └── use-media-query.ts          # Responsive breakpoint hook
├── lib/
│   ├── constants.ts                # Currency, shipping costs, limits
│   ├── fetcher.ts                  # Type-safe fetch wrapper with FetchError
│   ├── format.ts                   # Price formatter (cents -> currency)
│   ├── prisma.ts                   # PrismaClient singleton with adapter-pg
│   └── utils.ts                    # Class name merge utility (cn)
├── providers/
│   ├── cart-provider.tsx           # React Context for cart state & storage
│   ├── index.tsx                   # Composed providers wrapper
│   └── query-provider.tsx          # TanStack React Query provider
├── repositories/
│   ├── order.repository.ts         # PostgreSQL order CRUD repository via Prisma
│   └── product.repository.ts       # PostgreSQL product query repository via Prisma
└── types/
    ├── cart.ts                     # CartItem & CartState types
    ├── index.ts                    # Re-exports & generic API response types
    ├── order.ts                    # Order, Customer, Shipping Zod schemas
    └── product.ts                  # Product interface & Zod validation
```

---

## 🗄️ Database Architecture & Persistence

ShopZet uses **PostgreSQL** managed through **Prisma ORM** (`@prisma/client` and `@prisma/adapter-pg`).

### Schema Models (`prisma/schema.prisma`)

* **`Product`**: Stores product catalog information with prices in integer paise (e.g. `₹999.00` = `99900`), stock counts, categories, ratings, and image URLs. Indexed by `category` and `slug`.
* **`Order`**: Captures customer contact details, structured shipping address, order timestamp, calculated grand total, and `OrderStatus` (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`). Indexed by `customerEmail`.
* **`OrderItem`**: Relational join between orders and products capturing snapshot price and quantity at purchase time. Configured with cascade deletion on order delete.

### Data Access Layer (Repository Pattern)

All database operations are abstracted behind dedicated repository objects in `src/repositories/`:
* **`productRepository`**: Handles `getAll()`, `getById()`, `getBySlug()`, `getByCategory()`, `search()`, and `getCategories()`.
* **`orderRepository`**: Handles transactional order creation (`create()`), order lookup by ID (`getById()`), and customer order history (`getByEmail()`).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20+`
- **pnpm**: `v10+` (or `npm`, `yarn`, `bun`)
- **PostgreSQL**: Local PostgreSQL instance or cloud PostgreSQL (e.g. [Neon](https://neon.tech), Supabase)

### 1. Clone the repository
```bash
git clone <repository-url>
cd insta_hire_zetwerk
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Configure your `DATABASE_URL` in `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/insta_hire_zetwerk?schema=public"
```

### 4. Initialize & Seed Database
```bash
# Generate Prisma Client
pnpm prisma:generate

# Push schema to PostgreSQL (or run migrations with `pnpm db:migrate`)
pnpm db:push

# Seed catalog with initial product data
pnpm db:seed
```

### 5. Run Development Server
```bash
pnpm dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Available Scripts & Testing

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js development server with hot-reloading |
| `pnpm build` | Create production-ready Next.js build |
| `pnpm start` | Run production server locally |
| `pnpm typecheck` | Run strict TypeScript compiler checks (`tsc --noEmit`) |
| `pnpm lint` | Run ESLint across entire codebase |
| `pnpm lint:fix` | Automatically fix ESLint warnings and errors |
| `pnpm test` | Run unit & integration tests with Vitest |
| `pnpm prisma:generate` | Generate Prisma Client types from `prisma/schema.prisma` |
| `pnpm db:push` | Push schema state directly to PostgreSQL database |
| `pnpm db:migrate` | Create and apply database migrations (`prisma migrate dev`) |
| `pnpm db:seed` | Seed PostgreSQL database with initial catalog products |
| `pnpm db:studio` | Launch Prisma Studio GUI browser for database inspection |

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
