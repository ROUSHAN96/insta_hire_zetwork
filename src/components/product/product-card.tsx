'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye, Heart, Truck, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/format';
import { AddToCartButton } from './add-to-cart-button';
import { QuickViewModal } from './quick-view-modal';
import { cn } from '@/lib/utils';

import { useWishlist } from '@/hooks/use-wishlist';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const liked = isWishlisted(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const originalPrice = Math.round(product.price * 1.25);
  const discountPercent = 20;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden group rounded-3xl border-border/50 bg-card hover:border-border hover:shadow-xl transition-all duration-300 relative select-none">
        {/* Product Image Area */}
        <div className="relative aspect-4/3 overflow-hidden bg-muted/50">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
            />
          </Link>

          {/* Quick View Button Hover Overlay */}
          <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-background/90 text-foreground hover:bg-background text-xs font-bold shadow-lg backdrop-blur-md border border-border/60 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Quick View</span>
            </button>
          </div>

          {/* Top Badges & Wishlist Trigger */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-background/90 backdrop-blur-md text-foreground shadow-2xs border border-border/40">
                {product.category}
              </Badge>
              <span className="text-[10px] font-extrabold uppercase bg-rose-500 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                -{discountPercent}%
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'pointer-events-auto size-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 cursor-pointer shadow-xs',
                liked
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-background/80 text-muted-foreground hover:text-rose-500 hover:bg-background border-border/50'
              )}
              aria-label="Add to wishlist"
            >
              <Heart className={cn('h-4 w-4', liked && 'fill-white')} />
            </button>
          </div>
        </div>

        {/* Product Content */}
        <CardContent className="flex-1 p-5 flex flex-col space-y-2.5">
          {/* Rating and Stock Pulse */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold text-[11px] border border-amber-500/20">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
            </div>

            <div>
              {isOutOfStock ? (
                <span className="text-[11px] font-bold text-destructive">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="group-hover:text-primary transition-colors">
            <h3 className="font-bold text-sm sm:text-base tracking-tight text-foreground line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Pricing & Free Delivery Tag */}
          <div className="pt-2 mt-auto border-t border-border/40 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
              <Truck className="h-3 w-3 text-primary" />
              <span>Free 2-day delivery available</span>
            </div>
          </div>
        </CardContent>

        {/* Card Footer Actions */}
        <CardFooter className="p-5 pt-0">
          <div className="w-full" onClick={(e) => e.preventDefault()}>
            <AddToCartButton product={product} />
          </div>
        </CardFooter>
      </Card>

      {/* Quick View Dialog */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
