'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Flame,
  CheckCircle2,
  Share2,
  Heart,
  ChevronRight,
  Package,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Check,
} from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { buttonVariants } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'shipping' | 'reviews'>('overview');
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [viewersCount, setViewersCount] = useState(14);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const liked = isWishlisted(product.id);
  const originalPrice = Math.round(product.price * 1.25);
  const savings = originalPrice - product.price;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  useEffect(() => {
    // Random subtle viewer fluctuations
    const interval = setInterval(() => {
      setViewersCount((prev) => Math.max(9, Math.min(24, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
  };

  return (
    <div className="space-y-12">
      {/* 1. Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Image Gallery & Badges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square overflow-hidden rounded-3xl border border-border/60 bg-muted/40 shadow-sm group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-104"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-bold px-3 py-1 rounded-xl bg-background/90 backdrop-blur-md shadow-xs border border-border/40">
                {product.category}
              </Badge>
              <span className="text-xs font-extrabold uppercase bg-rose-500 text-white px-2.5 py-0.5 rounded-lg shadow-xs">
                SAVE 20%
              </span>
            </div>

            {/* Wishlist Button on Image */}
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'absolute top-4 right-4 size-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 cursor-pointer shadow-md',
                liked
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-background/80 text-muted-foreground hover:text-rose-500 hover:bg-background border-border/60'
              )}
              aria-label="Save to Wishlist"
            >
              <Heart className={cn('h-5 w-5', liked && 'fill-white')} />
            </button>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center">
                <Badge variant="destructive" className="text-sm font-bold px-4 py-2 rounded-xl shadow-lg">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Social Proof Live Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/60 border border-border/50 text-xs">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Flame className="h-4 w-4 text-rose-500 animate-bounce" />
              <span>
                <strong className="text-rose-600 dark:text-rose-400">{viewersCount} people</strong> viewing this right now
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">⚡ High Demand</span>
          </div>
        </div>

        {/* Right Column: Product Info, Options & Buy Box */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          {/* Rating, Category & Stock status */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-xl text-xs font-bold border border-amber-500/20">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating.toFixed(1)} Rating</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">•</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Authentic Certified
              </span>
              <span className="text-xs text-muted-foreground font-medium">•</span>
              <span className="text-xs text-muted-foreground">SKU: SZ-{product.id.slice(0, 6).toUpperCase()}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              {product.name}
            </h1>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-3xl bg-secondary/50 border border-border/60 space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  {formatPrice(product.price)}
                </span>
                <span className="text-base text-muted-foreground line-through font-medium">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                  Save {formatPrice(savings)}
                </span>
              </div>

              <div>
                {isOutOfStock ? (
                  <Badge variant="destructive" className="rounded-lg">Out of stock</Badge>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                    Only {product.stock} left in stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    {product.stock} available
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Order within <strong className="text-foreground">3 hrs 42 mins</strong> for same-day dispatch.</span>
            </div>
          </div>

          {/* Brief Overview */}
          <div className="space-y-1.5">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Edition / Variant Selector */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Edition / Style
            </label>
            <div className="flex items-center gap-2">
              {['Standard Edition', 'Pro Bundle', 'Collector Pack'].map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                    selectedVariant === v
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card text-muted-foreground hover:text-foreground border-border/60 hover:bg-secondary'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <AddToCartButton product={product} size="lg" className="w-full h-14 text-base rounded-2xl shadow-lg" />
            </div>
            <Link
              href="/cart"
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'h-14 rounded-2xl px-7 font-bold border-border/70 hover:bg-secondary',
              })}
            >
              Go to Bag
            </Link>
          </div>

          {/* Trust Value Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/40 text-xs">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <div className="leading-tight">
                <span className="font-bold block text-foreground">Express Shipping</span>
                <span className="text-muted-foreground text-[11px]">2-4 business days</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/40 text-xs">
              <RotateCcw className="h-4 w-4 text-primary shrink-0" />
              <div className="leading-tight">
                <span className="font-bold block text-foreground">30-Day Returns</span>
                <span className="text-muted-foreground text-[11px]">100% money back</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border/40 text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <div className="leading-tight">
                <span className="font-bold block text-foreground">2-Year Warranty</span>
                <span className="text-muted-foreground text-[11px]">Complete coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detailed Tabbed Specifications & Reviews */}
      <div className="pt-8 border-t border-border/50">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-px">
          {[
            { key: 'overview', label: 'Product Highlights' },
            { key: 'specs', label: 'Technical Specs' },
            { key: 'shipping', label: 'Shipping & Delivery' },
            { key: 'reviews', label: `Customer Reviews (${product.rating.toFixed(1)}★)` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                'px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer',
                activeTab === tab.key
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-3xl">
              <h3 className="text-lg font-bold text-foreground">Why You&apos;ll Love This Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>Premium Materials:</strong> Crafted using tested, industry-leading durable materials designed for long longevity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>Ergonomic & Intuitive:</strong> Engineered for maximum comfort and effortless daily functionality.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span><strong>Energy Efficient & Sustainable:</strong> Packaged in 100% recyclable, minimal waste packaging.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-3xl overflow-hidden rounded-2xl border border-border/50 bg-card">
              <div className="divide-y divide-border/40 text-xs sm:text-sm">
                <div className="grid grid-cols-3 p-4 bg-muted/20">
                  <span className="font-semibold text-muted-foreground">Category</span>
                  <span className="col-span-2 font-medium text-foreground">{product.category}</span>
                </div>
                <div className="grid grid-cols-3 p-4">
                  <span className="font-semibold text-muted-foreground">Product ID</span>
                  <span className="col-span-2 font-mono font-medium text-foreground">{product.id}</span>
                </div>
                <div className="grid grid-cols-3 p-4 bg-muted/20">
                  <span className="font-semibold text-muted-foreground">Availability</span>
                  <span className="col-span-2 font-medium text-emerald-600 dark:text-emerald-400">In Stock ({product.stock} units available)</span>
                </div>
                <div className="grid grid-cols-3 p-4">
                  <span className="font-semibold text-muted-foreground">Warranty</span>
                  <span className="col-span-2 font-medium text-foreground">2 Years Manufacturer Warranty Included</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                All orders are dispatched from our regional fulfilment warehouses within 24 hours of placement.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 space-y-1">
                  <span className="font-bold text-foreground block">Express Delivery</span>
                  <p className="text-xs">2-4 Business days. Free for orders over ₹999.</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 space-y-1">
                  <span className="font-bold text-foreground block">30-Day Money Back</span>
                  <p className="text-xs">Free instant return label included with package.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {/* Rating Summary Bar */}
              <div className="p-6 rounded-3xl bg-secondary/50 border border-border/60 flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center sm:text-left space-y-1">
                  <div className="text-5xl font-black text-foreground">{product.rating.toFixed(1)}</div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500">
                    {'★'.repeat(Math.round(product.rating))}
                    {'☆'.repeat(5 - Math.round(product.rating))}
                  </div>
                  <span className="text-xs text-muted-foreground block">Based on 128 verified ratings</span>
                </div>

                <div className="flex-1 w-full space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-8">5 ★</span>
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[85%]" />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">85%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8">4 ★</span>
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[12%]" />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">12%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8">3 ★</span>
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[3%]" />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">3%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Sticky Add-to-Cart Bottom Bar on Scroll */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/60 p-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative size-12 rounded-xl overflow-hidden bg-muted shrink-0 border">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate">{product.name}</h4>
                <span className="text-xs font-bold text-primary">{formatPrice(product.price)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <AddToCartButton product={product} size="default" className="rounded-xl px-6 h-11 font-bold shadow-md" />
              <Link href="/cart" className={buttonVariants({ variant: 'outline', className: 'rounded-xl h-11 font-bold hidden sm:inline-flex' })}>
                View Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
