'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-4 flex-1">
        <Link href={`/products/${product.slug}`} className="shrink-0 relative h-20 w-20 rounded-md overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </Link>
        <div className="flex flex-col min-w-0">
          <Link href={`/products/${product.slug}`} className="font-medium text-base hover:underline truncate">
            {product.name}
          </Link>
          <span className="text-sm text-muted-foreground">{formatPrice(product.price)} each</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
        <div className="flex items-center space-x-2 bg-secondary rounded-md p-1 border">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-6 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
            disabled={quantity >= Math.min(MAX_QUANTITY_PER_ITEM, product.stock)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="font-semibold w-24 text-right">
          {formatPrice(subtotal)}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
          onClick={handleRemove}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
