'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants, Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';
import { ShieldCheck, ArrowRight, Tag, Lock, Check, Gift, Zap } from 'lucide-react';

export function CartSummary() {
  const { items, totalPrice, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isGift, setIsGift] = useState(false);

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST;
  const orderTotal = totalPrice + shippingCost;
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return null;
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  return (
    <Card className="w-full sticky top-24 rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden space-y-0">
      <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
        <CardTitle className="text-xl font-bold tracking-tight text-foreground flex items-center justify-between">
          <span>Order Summary</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Cost Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Items Subtotal</span>
            <span className="font-semibold text-foreground">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span className="flex items-center gap-1">
              Estimated Shipping
            </span>
            <span>
              {isFreeShipping ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md text-xs">
                  FREE
                </span>
              ) : (
                <span className="font-semibold text-foreground">{formatPrice(shippingCost)}</span>
              )}
            </span>
          </div>

          {!isFreeShipping && (
            <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-2xl">
              Add <span className="font-bold text-foreground">{formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)}</span> more for Free Express Delivery.
            </p>
          )}
        </div>

        {/* Gift Wrapping Option */}
        <div
          onClick={() => setIsGift(!isGift)}
          className="p-3 rounded-2xl bg-secondary/40 border border-border/40 flex items-center justify-between text-xs cursor-pointer select-none hover:bg-secondary/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Add free personalized gift message</span>
          </div>
          <div className={`size-4 rounded-md border flex items-center justify-center ${isGift ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}>
            {isGift && <Check className="h-3 w-3" />}
          </div>
        </div>

        {/* Promo Code Input Box */}
        <form onSubmit={handleApplyPromo} className="pt-1">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Discount code (e.g. SAVE20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="pl-9 h-10 text-xs rounded-xl uppercase bg-background"
                disabled={promoApplied}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="h-10 px-3.5 rounded-xl text-xs font-bold"
              disabled={promoApplied || !promoCode.trim()}
            >
              {promoApplied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : 'Apply'}
            </Button>
          </div>
          {promoApplied && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1 font-semibold">
              <Check className="h-3 w-3" /> Coupon &apos;{promoCode.toUpperCase()}&apos; applied successfully!
            </p>
          )}
        </form>

        <Separator className="border-border/60" />

        {/* Total Price */}
        <div className="flex justify-between items-baseline pt-1">
          <div>
            <span className="text-base font-bold text-foreground">Estimated Total</span>
            <p className="text-[11px] text-muted-foreground">Taxes & duties included</p>
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">
            {formatPrice(orderTotal)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex-col gap-3">
        {/* Main Standard Checkout */}
        <Link
          href="/checkout"
          className={buttonVariants({
            size: 'lg',
            className: 'w-full h-14 rounded-2xl text-sm font-black shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all group',
          })}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Express Checkout Options Header */}
        <div className="w-full flex items-center gap-2 pt-1">
          <span className="h-px flex-1 bg-border/60" />
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Or Express Checkout</span>
          <span className="h-px flex-1 bg-border/60" />
        </div>

        {/* Instant Checkout Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            <span> Pay</span>
          </Link>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
          >
            <Zap className="h-3.5 w-3.5 fill-slate-950" />
            <span>Fast Checkout</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="w-full pt-3 mt-1 border-t border-border/40 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-primary" />
          <span>256-Bit SSL Encrypted & Verified Safe</span>
        </div>
      </CardFooter>
    </Card>
  );
}
