'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCart } from '@/hooks/use-cart';
import { MAX_QUANTITY_PER_ITEM } from '@/lib/constants';

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
      <div className="flex items-center space-x-2 bg-secondary rounded-md p-1 w-full justify-between sm:w-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrement}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium w-4 text-center">{quantity}</span>
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
    );
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={isOutOfStock}
      size={size}
      className={`w-full sm:w-auto transition-all relative overflow-hidden ${className ?? ''}`}
    >
      <div className={`flex items-center space-x-2 transition-transform duration-300 ${showToast ? '-translate-y-10' : 'translate-y-0'}`}>
        <ShoppingCart className="h-4 w-4" />
        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground font-medium transition-transform duration-300 ${showToast ? 'translate-y-0' : 'translate-y-10'}`}>
        Added!
      </div>
    </Button>
  );
}
