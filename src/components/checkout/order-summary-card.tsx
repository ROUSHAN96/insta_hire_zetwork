'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';

export function OrderSummaryCard() {
  const { items, totalPrice } = useCart();

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST;
  const orderTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="w-full sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4">
              <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted border">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <h4 className="text-sm font-medium line-clamp-2">{item.product.name}</h4>
                <div className="text-xs text-muted-foreground mt-1">
                  Qty: {item.quantity}
                </div>
              </div>
              <div className="text-sm font-medium text-right shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {isFreeShipping ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(shippingCost)
              )}
            </span>
          </div>
        </div>

        <Separator />
        
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(orderTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
