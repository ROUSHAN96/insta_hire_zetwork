'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummaryCard } from '@/components/checkout/order-summary-card';
import { buttonVariants } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import type { CheckoutFormData } from '@/types/order';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice: subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  // Redirect to cart if empty (after mount)
  if (hasMounted && items.length === 0 && !isSubmitting) {
    router.replace('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        items,
        customer: data.customer,
        shippingAddress: data.shippingAddress,
        totalPrice: total,
      };

      const response = await fetcher<{ success: boolean; data: { id: string } }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.success && response.data?.id) {
        clearCart();
        router.push(`/order-confirmation/${response.data.id}`);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link
        href="/cart"
        className={buttonVariants({ variant: 'ghost', className: 'mb-6 -ml-4' })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 xl:col-span-8">
          <CheckoutForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
  );
}
