import { test, expect } from "@playwright/test";

test.describe("Home Page & Product Browsing", () => {
  test("loads landing page and renders product catalog", async ({ page }) => {
    await page.goto("/");

    // Verify main heading
    await expect(page.locator("h1")).toContainText("Our Products");
    await expect(page.getByText("Browse our curated collection of premium products")).toBeVisible();

    // Verify search bar is visible
    const searchInput = page.getByPlaceholder("Search products...");
    await expect(searchInput).toBeVisible();

    // Verify category filters exist
    await expect(page.getByRole("button", { name: "All", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Electronics" })).toBeVisible();
  });

  test("filters products by category", async ({ page }) => {
    await page.goto("/");

    // Click on 'Electronics' category filter
    const electronicsBtn = page.getByRole("button", { name: "Electronics" });
    await expect(electronicsBtn).toBeVisible();
    await electronicsBtn.click();

    // Verify electronics products are displayed
    await expect(page.getByText("Wireless Noise-Canceling Headphones")).toBeVisible();
    await expect(page.getByText("Mechanical Keyboard RGB")).toBeVisible();
  });

  test("filters products using search input", async ({ page }) => {
    await page.goto("/");

    // Find search input
    const searchInput = page.getByPlaceholder("Search products...");
    await expect(searchInput).toBeVisible();

    // Search for 'Headphones'
    await searchInput.fill("Headphones");

    // Verify search result
    await expect(page.getByText("Wireless Noise-Canceling Headphones")).toBeVisible();
  });

  test("navigates to product detail page", async ({ page }) => {
    await page.goto("/");

    // Find and click a product
    const productLink = page.getByRole("link", { name: /Wireless Noise-Canceling Headphones/i }).first();
    await expect(productLink).toBeVisible();
    await productLink.click();

    // Verify we navigated to the product detail page
    await expect(page).toHaveURL(/.*\/products\/.+/);
    await expect(page.locator("h1")).toContainText("Wireless Noise-Canceling Headphones");
    await expect(page.getByRole("button", { name: /add to cart/i })).toBeVisible();
  });
});
