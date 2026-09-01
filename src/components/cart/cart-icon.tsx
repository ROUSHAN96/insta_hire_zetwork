'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CartIcon() {
  const { totalItems } = useCart();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'icon' }),
        'relative',
      )}
      aria-label={`Shopping cart${hasMounted && totalItems > 0 ? ` with ${totalItems} items` : ''}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {hasMounted && totalItems > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 min-w-[20px] items-center justify-center rounded-full p-1 text-[10px]"
          variant="destructive"
        >
          {totalItems}
        </Badge>
      )}
    </Link>
  );
}
