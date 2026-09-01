'use client';

import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowLeft, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { EmptyState } from '@/components/feedback/empty-state';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummary } from '@/components/cart/cart-summary';
import { Button, buttonVariants } from '@/components/ui/button';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <EmptyState
          title="Your shopping cart is empty"
          description="Explore our collection of premium electronics, apparel, books, and home essentials to find something you love."
          icon={<ShoppingBag className="size-16 text-muted-foreground stroke-1" />}
          action={
            <Link
              href="/#products"
              className={buttonVariants({ size: 'lg', className: 'rounded-xl font-semibold px-8 shadow-md' })}
            >
              <span>Explore Products</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const progressPercent = Math.min(100, Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        {/* Navigation back */}
        <Link
          href="/"
          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'mb-6 -ml-2 rounded-xl text-muted-foreground hover:text-foreground' })}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Continue Shopping
        </Link>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-border/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Your Bag</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-0.5">
              Shopping Cart
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              You have <span className="font-semibold text-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span> in your cart
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-muted-foreground hover:text-destructive hover:border-destructive/40 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Clear Cart
          </Button>
        </div>

        {/* Free Shipping Progress Meter Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-secondary/60 border border-border/50 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              {isFreeShipping ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Congratulations! You unlocked Free Express Shipping!
                </span>
              ) : (
                <span>
                  Add <span className="font-bold text-foreground">{formatPrice(amountNeeded)}</span> more to unlock <span className="text-primary font-bold">Free Shipping</span>
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-mono">{progressPercent}%</span>
          </div>

          {/* Progress track */}
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Item List */}
          <div className="lg:col-span-7 xl:col-span-8 bg-card rounded-3xl border border-border/50 p-6 shadow-xs divide-y divide-border/40">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
