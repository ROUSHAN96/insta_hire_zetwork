"use client";

import * as React from "react";
import { createContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface WishlistContextValue {
  wishlistIds: string[];
  totalWishlist: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "shopzet_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useLocalStorage<string[]>(WISHLIST_STORAGE_KEY, []);

  const totalWishlist = useMemo(() => wishlistIds.length, [wishlistIds]);

  const isWishlisted = useCallback(
    (productId: string) => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((current) => {
        if (current.includes(productId)) {
          return current.filter((id) => id !== productId);
        }
        return [...current, productId];
      });
    },
    [setWishlistIds]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, [setWishlistIds]);

  const value = useMemo(
    () => ({
      wishlistIds,
      totalWishlist,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
    }),
    [wishlistIds, totalWishlist, isWishlisted, toggleWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
