import { describe, it, expect } from "vitest";
import {
  customerInfoSchema,
  shippingAddressSchema,
  checkoutFormSchema,
  createOrderInputSchema,
  paymentMethodSchema,
} from "./order";

describe("Order Zod Schemas", () => {
  describe("customerInfoSchema", () => {
    it("should validate correct customer info", () => {
      const valid = {
        name: "John Doe",
        email: "john@example.com",
        phone: "5551234567",
      };
      const result = customerInfoSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalid = {
        name: "John Doe",
        email: "not-an-email",
        phone: "5551234567",
      };
      const result = customerInfoSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject short name", () => {
      const invalid = {
        name: "J",
        email: "john@example.com",
        phone: "5551234567",
      };
      const result = customerInfoSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject short phone number", () => {
      const invalid = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123",
      };
      const result = customerInfoSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject phone number with invalid letters", () => {
      const invalid = {
        name: "John Doe",
        email: "john@example.com",
        phone: "98765abcde",
      };
      const result = customerInfoSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("shippingAddressSchema", () => {
    it("should validate a complete and valid address", () => {
      const valid = {
        street: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "United States",
      };
      const result = shippingAddressSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject missing required address fields", () => {
      const invalid = {
        street: "",
        city: "",
        state: "CA",
        zipCode: "123",
        country: "US",
      };
      const result = shippingAddressSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("paymentMethodSchema", () => {
    it("should accept valid payment modes", () => {
      expect(paymentMethodSchema.safeParse("cod").success).toBe(true);
      expect(paymentMethodSchema.safeParse("upi").success).toBe(true);
      expect(paymentMethodSchema.safeParse("card").success).toBe(true);
    });

    it("should reject unknown payment mode", () => {
      expect(paymentMethodSchema.safeParse("crypto").success).toBe(false);
    });
  });

  describe("checkoutFormSchema", () => {
    it("should validate full checkout payload", () => {
      const valid = {
        customer: {
          name: "Alice Smith",
          email: "alice@company.com",
          phone: "9876543210",
        },
        shippingAddress: {
          street: "456 Oak Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        paymentMethod: "upi",
      };
      const result = checkoutFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.paymentMethod).toBe("upi");
      }
    });

    it("should default payment method to cod when not provided", () => {
      const validWithoutPayment = {
        customer: {
          name: "Alice Smith",
          email: "alice@company.com",
          phone: "9876543210",
        },
        shippingAddress: {
          street: "456 Oak Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
      };
      const result = checkoutFormSchema.safeParse(validWithoutPayment);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.paymentMethod).toBe("cod");
      }
    });
  });

  describe("createOrderInputSchema", () => {
    const sampleProduct = {
      id: "prod_1",
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Sample product",
      price: 199900,
      image: "https://images.unsplash.com/sample",
      category: "Electronics",
      stock: 10,
      rating: 4.5,
    };

    it("should validate a valid complete order input", () => {
      const valid = {
        items: [{ product: sampleProduct, quantity: 1 }],
        customer: {
          name: "Alice Smith",
          email: "alice@company.com",
          phone: "9876543210",
        },
        shippingAddress: {
          street: "456 Oak Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        totalPrice: 199900,
        paymentMethod: "card",
      };

      const result = createOrderInputSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject an order with empty items array", () => {
      const invalid = {
        items: [],
        customer: {
          name: "Alice Smith",
          email: "alice@company.com",
          phone: "9876543210",
        },
        shippingAddress: {
          street: "456 Oak Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        totalPrice: 0,
      };

      const result = createOrderInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject negative total price", () => {
      const invalid = {
        items: [{ product: sampleProduct, quantity: 1 }],
        customer: {
          name: "Alice Smith",
          email: "alice@company.com",
          phone: "9876543210",
        },
        shippingAddress: {
          street: "456 Oak Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        totalPrice: -100,
      };

      const result = createOrderInputSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
