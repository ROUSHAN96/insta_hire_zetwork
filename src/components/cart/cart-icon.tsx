'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
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
        'relative rounded-xl hover:bg-muted transition-all duration-200 active:scale-95 text-foreground'
      )}
      aria-label={`Shopping cart${hasMounted && totalItems > 0 ? ` with ${totalItems} items` : ''}`}
    >
      <ShoppingBag className="h-5 w-5 transition-transform duration-200 hover:scale-105" />
      {hasMounted && totalItems > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 items-center justify-center rounded-full text-[11px] font-bold bg-primary text-primary-foreground border-2 border-background shadow-xs animate-in zoom-in-50 duration-200"
          variant="default"
        >
          {totalItems}
        </Badge>
      )}
    </Link>
  );
}
