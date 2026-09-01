import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice utility (INR)", () => {
  it("should format paise into Indian Rupee currency string", () => {
    expect(formatPrice(299900)).toBe("₹2,999.00");
    expect(formatPrice(49900)).toBe("₹499.00");
    expect(formatPrice(100)).toBe("₹1.00");
    expect(formatPrice(0)).toBe("₹0.00");
    expect(formatPrice(50)).toBe("₹0.50");
  });

  it("should format large amounts with Indian numbering system separators", () => {
    expect(formatPrice(2499900)).toBe("₹24,999.00");
    expect(formatPrice(10000000)).toBe("₹1,00,000.00");
  });
});
