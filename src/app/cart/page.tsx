'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { EmptyState } from '@/components/feedback/empty-state';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummary } from '@/components/cart/cart-summary';
import { Button, buttonVariants } from '@/components/ui/button';

export default function CartPage() {
  const { items, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added any products to your cart yet."
          icon={<ShoppingCart className="size-16" />}
          action={
            <Link href="/" className={buttonVariants()}>
              Continue Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
