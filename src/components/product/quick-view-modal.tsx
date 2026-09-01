'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Truck, ShieldCheck, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { buttonVariants } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const liked = isWishlisted(product.id);
  const originalPrice = Math.round(product.price * 1.25);
  const discountPercent = 20;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-background border border-border shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex size-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-md border border-border/50 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image */}
          <div className="relative aspect-square md:aspect-auto bg-muted/40 p-6 flex items-center justify-center">
            <div className="relative h-full w-full min-h-[260px] md:min-h-[360px] rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="font-semibold text-xs rounded-lg bg-background/90 backdrop-blur-md shadow-xs">
                  {product.category}
                </Badge>
              </div>

              {/* Wishlist Button inside Modal */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  'absolute top-3 right-3 size-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 cursor-pointer shadow-xs',
                  liked
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-background/80 text-muted-foreground hover:text-rose-500 hover:bg-background border-border/50'
                )}
                aria-label="Add to wishlist"
              >
                <Heart className={cn('h-4 w-4', liked && 'fill-white')} />
              </button>

              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-md shadow-xs">
                  {discountPercent}% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Rating & Stock status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-500/20">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <div>
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-destructive">Out of Stock</span>
                  ) : isLowStock ? (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      Only {product.stock} left!
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-extrabold text-foreground">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground line-through font-medium">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Save {formatPrice(originalPrice - product.price)}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Quick Perks */}
              <div className="pt-2 flex flex-col gap-1.5 text-xs text-muted-foreground border-t border-border/40">
                <span className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Free express shipping on orders over $50</span>
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>100% genuine product guaranteed</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <AddToCartButton product={product} size="default" className="w-full h-11" />
              <Link
                href={`/products/${product.slug}`}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full h-10 rounded-xl text-xs font-semibold justify-center',
                })}
                onClick={onClose}
              >
                <span>View Full Product Details</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
