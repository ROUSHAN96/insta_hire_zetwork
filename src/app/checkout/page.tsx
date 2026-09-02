'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummaryCard } from '@/components/checkout/order-summary-card';
import { buttonVariants } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';
import { useToast } from '@/hooks/use-toast';
import {
  createOrderInputSchema,
  type CheckoutFormData,
  type CreateOrderInput,
} from '@/types/order';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const { items, totalPrice: subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  // Redirect to cart if empty (after mount and not actively submitting)
  if (hasMounted && items.length === 0 && !isSubmitting) {
    router.replace('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);

    // Construct and validate complete order payload using Zod before submission
    const rawPayload: CreateOrderInput = {
      items,
      customer: data.customer,
      shippingAddress: data.shippingAddress,
      totalPrice: total,
      paymentMethod: data.paymentMethod || 'cod',
    };

    const validationResult = createOrderInputSchema.safeParse(rawPayload);

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      const errorMessage = firstIssue
        ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
        : 'Validation failed. Please review your checkout information.';
      setError(errorMessage);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetcher<{ success: boolean; data: { id: string } }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(validationResult.data),
      });

      if (response.success && response.data?.id) {
        toast.success(
          'Order Placed Successfully! 🎉',
          `Order #${response.data.id.slice(0, 8)}... confirmed. Receipt sent to ${validationResult.data.customer.email}`
        );
        clearCart();
        router.push(`/order-confirmation/${response.data.id}`);
      } else {
        throw new Error('Failed to place order. Please check details and try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        {/* Navigation back */}
        <Link
          href="/cart"
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: 'mb-6 -ml-2 rounded-xl text-muted-foreground hover:text-foreground',
          })}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to cart
        </Link>

        {/* Stepper Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Final Step</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-0.5">
              Secure Checkout
            </h1>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-foreground text-[11px] font-bold">
                1
              </span>
              <span>Cart</span>
            </div>
            <span className="h-px w-6 bg-border" />
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                2
              </span>
              <span>Details & Shipping</span>
            </div>
            <span className="h-px w-6 bg-border" />
            <div className="flex items-center gap-1.5 text-muted-foreground opacity-60">
              <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-[11px]">
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <CheckoutForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <OrderSummaryCard />
          </div>
        </div>
      </div>
    </div>
  );
}
