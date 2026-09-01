import { describe, it, expect } from "vitest";
import { customerInfoSchema, shippingAddressSchema, checkoutFormSchema } from "./order";

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
      };
      const result = checkoutFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });
});
