"use client";

import * as React from "react";
import { createContext, useCallback, useMemo } from "react";
import type { CartItem, Product } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { CART_STORAGE_KEY, MAX_QUANTITY_PER_ITEM } from "@/lib/constants";

export interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>(CART_STORAGE_KEY, []);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            MAX_QUANTITY_PER_ITEM,
            product.stock
          );
          
          return currentItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        const newQuantity = Math.min(quantity, MAX_QUANTITY_PER_ITEM, product.stock);
        if (newQuantity <= 0) return currentItems;

        return [...currentItems, { product, quantity: newQuantity }];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
    },
    [setItems]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((currentItems) => {
        if (quantity <= 0) {
          return currentItems.filter((item) => item.product.id !== productId);
        }

        return currentItems.map((item) => {
          if (item.product.id === productId) {
            const newQuantity = Math.min(quantity, MAX_QUANTITY_PER_ITEM, item.product.stock);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      });
    },
    [setItems]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
    }),
    [items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, getItemQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
