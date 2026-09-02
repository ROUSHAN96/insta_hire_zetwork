"use client";

import * as React from "react";
import { QueryProvider } from "./query-provider";
import { CartProvider } from "./cart-provider";
import { WishlistProvider } from "./wishlist-provider";
import { ToastProvider } from "./toast-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>{children}</ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryProvider>
  );
}
