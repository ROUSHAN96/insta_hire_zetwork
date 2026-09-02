import { z } from "zod";
import { productSchema } from "./product";
import type { CartItem } from "./cart";

export const customerInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address (e.g. name@example.com)"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9+\s()-]+$/, "Phone number must contain only numbers and valid symbols (+, -, () )"),
});

export const shippingAddressSchema = z.object({
  street: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address cannot exceed 200 characters"),
  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City cannot exceed 100 characters"),
  state: z
    .string()
    .trim()
    .min(2, "State is required")
    .max(100, "State cannot exceed 100 characters"),
  zipCode: z
    .string()
    .trim()
    .min(5, "PIN / Postal code must be at least 5 characters")
    .max(10, "PIN / Postal code cannot exceed 10 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Invalid PIN / Postal code format"),
  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(100, "Country cannot exceed 100 characters"),
});

export const paymentMethodSchema = z.enum(["card", "upi", "cod"]).default("cod");
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const checkoutFormSchema = z.object({
  customer: customerInfoSchema,
  shippingAddress: shippingAddressSchema,
  paymentMethod: paymentMethodSchema.optional().default("cod"),
});

export const cartItemSchema = z.object({
  product: productSchema,
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const createOrderInputSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Order must contain at least one item"),
  customer: customerInfoSchema,
  shippingAddress: shippingAddressSchema,
  totalPrice: z.number().int().nonnegative("Total price must be a non-negative integer"),
  paymentMethod: paymentMethodSchema.optional().default("cod"),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  totalPrice: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
}
