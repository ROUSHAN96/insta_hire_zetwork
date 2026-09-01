'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CartItem } from '@/types/cart';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/format';
import { MAX_QUANTITY_PER_ITEM } from '@/lib/constants';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const handleIncrement = () => {
    if (quantity < Math.min(MAX_QUANTITY_PER_ITEM, product.stock)) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  const subtotal = product.price * quantity;

  return (
    <div className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group">
      {/* Product Image and Meta */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          href={`/products/${product.slug}`}
          className="shrink-0 relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-muted/60 border border-border/50 transition-transform duration-200 group-hover:scale-102"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover"
          />
        </Link>

        <div className="flex flex-col min-w-0 space-y-1">
          <Badge variant="secondary" className="text-[10px] w-fit font-medium px-2 py-0.5 rounded-md">
            {product.category}
          </Badge>
          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-base text-foreground hover:text-primary transition-colors truncate"
          >
            {product.name}
          </Link>
          <div className="text-xs text-muted-foreground">
            Unit Price: <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>

      {/* Controls & Price */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
        {/* Stepper */}
        <div className="flex items-center bg-secondary/80 rounded-xl p-1 border border-border/60 shadow-2xs">
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 rounded-lg hover:bg-background transition-all text-foreground cursor-pointer"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-bold px-3 min-w-[28px] text-center text-foreground">{quantity}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 rounded-lg hover:bg-background transition-all text-foreground cursor-pointer"
            onClick={handleIncrement}
            disabled={quantity >= Math.min(MAX_QUANTITY_PER_ITEM, product.stock)}
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[80px]">
          <div className="text-base font-bold text-foreground">
            {formatPrice(subtotal)}
          </div>
          <span className="text-[10px] text-muted-foreground">Subtotal</span>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-xl shrink-0 transition-colors cursor-pointer"
          onClick={handleRemove}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
