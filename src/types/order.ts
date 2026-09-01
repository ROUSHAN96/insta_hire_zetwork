import { z } from "zod";
import type { CartItem } from "./cart";

export const customerInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export const shippingAddressSchema = z.object({
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country is required"),
});

export const checkoutFormSchema = z.object({
  customer: customerInfoSchema,
  shippingAddress: shippingAddressSchema,
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}
