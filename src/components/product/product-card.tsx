'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/format';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px]">
            <Badge variant="destructive" className="text-sm font-semibold">Out of Stock</Badge>
          </div>
        )}
      </Link>
      <CardContent className="flex-1 p-4 flex flex-col space-y-2">
        <div className="flex justify-between items-start mb-1">
          <Badge variant="secondary" className="text-xs font-normal">
            {product.category}
          </Badge>
          <div className="flex items-center text-sm font-medium text-amber-500">
            ★ {product.rating.toFixed(1)}
          </div>
        </div>
        <Link href={`/products/${product.slug}`} className="hover:underline">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        <div className="font-bold text-lg mt-auto">
          {formatPrice(product.price)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full" onClick={(e) => e.preventDefault()}>
          <AddToCartButton product={product} />
        </div>
      </CardFooter>
    </Card>
  );
}
