'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Minus, Check, Trash2 } from 'lucide-react';
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
      <div
        className={cn(
          'w-full flex items-center justify-between bg-secondary/90 hover:bg-secondary rounded-2xl p-1 border border-border/70 shadow-xs transition-all select-none',
          size === 'lg' ? 'h-14' : size === 'sm' ? 'h-9' : 'h-11',
          className
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <button
          type="button"
          className="size-9 rounded-xl flex items-center justify-center text-foreground hover:bg-background hover:text-rose-600 hover:shadow-xs transition-all active:scale-90 cursor-pointer"
          onClick={handleDecrement}
          aria-label={quantity === 1 ? "Remove item from cart" : "Decrease quantity"}
          title={quantity === 1 ? "Remove" : "Decrease"}
        >
          {quantity === 1 ? (
            <Trash2 className="h-4 w-4 text-rose-500" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
        </button>

        <div className="flex items-center gap-1.5 px-2">
          <span className="text-xs font-black text-foreground">{quantity}</span>
          <span className="text-[11px] font-semibold text-muted-foreground hidden sm:inline">in bag</span>
        </div>

        <button
          type="button"
          className="size-9 rounded-xl flex items-center justify-center text-foreground hover:bg-background hover:text-primary hover:shadow-xs transition-all active:scale-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleIncrement}
          disabled={quantity >= Math.min(MAX_QUANTITY_PER_ITEM, product.stock)}
          aria-label="Increase quantity"
          title="Add more"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleAdd}
      disabled={isOutOfStock}
      size={size}
      className={cn(
        'w-full h-11 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all duration-200 relative overflow-hidden active:scale-98 cursor-pointer',
        showToast && 'bg-emerald-600 hover:bg-emerald-600 text-white',
        isOutOfStock && 'opacity-60 cursor-not-allowed shadow-none',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center gap-2 transition-transform duration-300',
          showToast ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
        )}
      >
        <ShoppingBag className="h-4 w-4 shrink-0" />
        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
      </div>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center gap-1.5 font-bold text-white transition-all duration-300',
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <Check className="h-4 w-4" />
        <span>Added to Bag!</span>
      </div>
    </Button>
  );
}
