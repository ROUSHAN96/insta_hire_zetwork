'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';
import { ShieldCheck, Truck, Clock } from 'lucide-react';

export function OrderSummaryCard() {
  const { items, totalPrice, totalItems } = useCart();

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST;
  const orderTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="w-full sticky top-24 rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
        <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-center justify-between">
          <span>Items in Order</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-secondary text-secondary-foreground">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* Item List */}
        <div className="space-y-3.5 max-h-[36vh] overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3.5">
              <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-muted/60 border border-border/50">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h4 className="text-xs font-semibold text-foreground line-clamp-1">{item.product.name}</h4>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Qty: <span className="font-semibold text-foreground">{item.quantity}</span> × {formatPrice(item.product.price)}
                </div>
              </div>
              <div className="text-xs font-bold text-foreground text-right shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <Separator className="border-border/60" />

        {/* Cost breakdown */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping & Handling</span>
            <span>
              {isFreeShipping ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  FREE
                </span>
              ) : (
                <span className="font-semibold text-foreground">{formatPrice(shippingCost)}</span>
              )}
            </span>
          </div>
        </div>

        <Separator className="border-border/60" />

        {/* Total */}
        <div className="flex justify-between items-baseline pt-1">
          <div>
            <span className="text-sm font-bold text-foreground">Total Due</span>
            <p className="text-[10px] text-muted-foreground">Includes all applicable taxes</p>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            {formatPrice(orderTotal)}
          </span>
        </div>

        {/* Delivery Guarantee Info */}
        <div className="pt-2 border-t border-border/40 space-y-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Estimated delivery in 2-4 business days</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Encrypted payment & verified purchase guarantee</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
