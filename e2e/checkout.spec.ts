import { test, expect } from "@playwright/test";

test.describe("Cart & Checkout Flow", () => {
  test("adds a product to cart and visits cart page", async ({ page }) => {
    await page.goto("/");

    // Add first available product to cart
    const addToCartButton = page.getByRole("button", { name: /add to cart/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Navigate to cart
    await page.goto("/cart");

    // Verify cart page loaded with items
    await expect(page.locator("h1")).toContainText("Shopping Cart");
    await expect(page.getByRole("link", { name: /proceed to checkout/i })).toBeVisible();
  });
});
