'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCart } from '@/hooks/use-cart';
import { MAX_QUANTITY_PER_ITEM } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  size?: 'default' | 'lg' | 'sm';
  className?: string;
}

export function AddToCartButton({ product, size = 'default', className }: AddToCartButtonProps) {
  const { addItem, updateQuantity, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const isInCart = quantity > 0;
  const isOutOfStock = product.stock === 0;

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
      setShowToast(true);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < Math.min(MAX_QUANTITY_PER_ITEM, product.stock)) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  if (isInCart) {
    return (
      <div className={cn(
        'flex items-center justify-between bg-secondary/80 rounded-xl p-1 border border-border/60 shadow-2xs w-full sm:w-auto',
        className
      )}>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 rounded-lg hover:bg-background hover:shadow-xs transition-all text-foreground cursor-pointer"
          onClick={handleDecrement}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs font-bold px-3 min-w-[28px] text-center text-foreground">{quantity}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 rounded-lg hover:bg-background hover:shadow-xs transition-all text-foreground cursor-pointer"
          onClick={handleIncrement}
          disabled={quantity >= Math.min(MAX_QUANTITY_PER_ITEM, product.stock)}
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={isOutOfStock}
      size={size}
      className={cn(
        'w-full sm:w-auto transition-all duration-200 relative overflow-hidden rounded-xl font-semibold active:scale-95 shadow-sm',
        showToast && 'bg-emerald-600 hover:bg-emerald-600 text-white',
        className
      )}
    >
      <div className={cn(
        'flex items-center justify-center gap-2 transition-transform duration-300',
        showToast ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
      )}>
        <ShoppingBag className="h-4 w-4" />
        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
      </div>
      <div className={cn(
        'absolute inset-0 flex items-center justify-center gap-1.5 font-semibold text-white transition-all duration-300',
        showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}>
        <Check className="h-4 w-4" />
        <span>Added!</span>
      </div>
    </Button>
  );
}
