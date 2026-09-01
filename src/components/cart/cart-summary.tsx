'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';

export function CartSummary() {
  const { items, totalPrice, totalItems } = useCart();

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST;
  const orderTotal = totalPrice + shippingCost;
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return null;
  }

  return (
    <Card className="w-full sticky top-24">
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {isFreeShipping ? (
              <span className="text-green-600 font-semibold">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>

        {!isFreeShipping && (
          <p className="text-xs text-muted-foreground">
            Spend {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} more for free shipping
          </p>
        )}

        <Separator />
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(orderTotal)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Link
          href="/checkout"
          className={buttonVariants({ size: 'lg', className: 'w-full' })}
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/"
          className={buttonVariants({ variant: 'outline', className: 'w-full' })}
        >
          Continue Shopping
        </Link>
      </CardFooter>
    </Card>
  );
}
