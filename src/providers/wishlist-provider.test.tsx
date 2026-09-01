import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { WishlistProvider } from "./wishlist-provider";
import { useWishlist } from "@/hooks/use-wishlist";

describe("WishlistProvider and useWishlist", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <WishlistProvider>{children}</WishlistProvider>
  );

  it("should initialize with an empty wishlist", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.wishlistIds).toEqual([]);
    expect(result.current.totalWishlist).toBe(0);
    expect(result.current.isWishlisted("prod_001")).toBe(false);
  });

  it("should toggle items into and out of the wishlist", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.toggleWishlist("prod_001");
    });

    expect(result.current.isWishlisted("prod_001")).toBe(true);
    expect(result.current.totalWishlist).toBe(1);

    act(() => {
      result.current.toggleWishlist("prod_001");
    });

    expect(result.current.isWishlisted("prod_001")).toBe(false);
    expect(result.current.totalWishlist).toBe(0);
  });

  it("should manage multiple liked products and clear them", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.toggleWishlist("prod_001");
      result.current.toggleWishlist("prod_002");
    });

    expect(result.current.totalWishlist).toBe(2);
    expect(result.current.isWishlisted("prod_001")).toBe(true);
    expect(result.current.isWishlisted("prod_002")).toBe(true);

    act(() => {
      result.current.clearWishlist();
    });

    expect(result.current.totalWishlist).toBe(0);
    expect(result.current.wishlistIds).toEqual([]);
  });
});
