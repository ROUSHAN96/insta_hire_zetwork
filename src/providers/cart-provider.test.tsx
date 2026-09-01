import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { CartProvider } from "./cart-provider";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types/product";

const mockProduct1: Product = {
  id: "prod_001",
  name: "Wireless Headphones",
  slug: "wireless-headphones",
  description: "High quality audio",
  price: 299900, // ₹2,999.00
  image: "https://images.unsplash.com/photo-1",
  category: "Electronics",
  stock: 10,
  rating: 4.8,
};

const mockProduct2: Product = {
  id: "prod_002",
  name: "Cotton T-Shirt",
  slug: "cotton-t-shirt",
  description: "Soft cotton",
  price: 29900, // ₹299.00
  image: "https://images.unsplash.com/photo-2",
  category: "Clothing",
  stock: 20,
  rating: 4.5,
};

describe("CartProvider and useCart", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it("should initialize with an empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("should add a product to the cart and compute totals accurately", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct1, 1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product.id).toBe("prod_001");
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(299900);
    expect(result.current.getItemQuantity("prod_001")).toBe(1);
  });

  it("should increment quantity when adding the same product again", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct1, 1);
    });
    act(() => {
      result.current.addItem(mockProduct1, 2);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(299900 * 3);
  });

  it("should handle multiple distinct products correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct1, 1);
      result.current.addItem(mockProduct2, 2);
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(299900 * 1 + 29900 * 2);
  });

  it("should update quantity directly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct1, 1);
    });
    act(() => {
      result.current.updateQuantity("prod_001", 5);
    });

    expect(result.current.getItemQuantity("prod_001")).toBe(5);
    expect(result.current.totalItems).toBe(5);
  });

  it("should remove item when quantity is updated to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct1, 2);
    });
    act(() => {
      result.current.updateQuantity("prod_001", 0);
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("should remove an item using removeItem", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct1, 1);
      result.current.addItem(mockProduct2, 1);
    });
    act(() => {
      result.current.removeItem("prod_001");
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product.id).toBe("prod_002");
    expect(result.current.totalPrice).toBe(29900);
  });

  it("should clear the entire cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct1, 2);
      result.current.addItem(mockProduct2, 3);
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("should cap quantity at product stock", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct1, 20); // stock is 10
    });

    expect(result.current.getItemQuantity("prod_001")).toBe(10);
  });
});
