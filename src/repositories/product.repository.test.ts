import { describe, it, expect, vi, beforeEach } from "vitest";
import productsData from "@/data/products.json";
import { productRepository } from "./product.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("ProductRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all products", async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue(productsData as any);

    const products = await productRepository.getAll();
    expect(products).toBeDefined();
    expect(products.length).toBe(12);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      orderBy: { id: "asc" },
    });
  });

  it("should get product by valid ID", async () => {
    const mockProduct = productsData[0];
    vi.mocked(prisma.product.findUnique).mockResolvedValue(mockProduct as any);

    const product = await productRepository.getById("prod_001");
    expect(product).toBeDefined();
    expect(product?.name).toBe("Wireless Noise-Canceling Headphones");
    expect(product?.price).toBe(299900);
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: "prod_001" },
    });
  });

  it("should return null for invalid ID", async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null);

    const product = await productRepository.getById("non_existent_id");
    expect(product).toBeNull();
  });

  it("should get product by valid slug", async () => {
    const mockProduct = productsData[1];
    vi.mocked(prisma.product.findUnique).mockResolvedValue(mockProduct as any);

    const product = await productRepository.getBySlug("mechanical-keyboard-rgb");
    expect(product).toBeDefined();
    expect(product?.id).toBe("prod_002");
    expect(product?.category).toBe("Electronics");
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { slug: "mechanical-keyboard-rgb" },
    });
  });

  it("should return null for invalid slug", async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null);

    const product = await productRepository.getBySlug("invalid-slug-404");
    expect(product).toBeNull();
  });

  it("should filter products by category correctly", async () => {
    const electronics = productsData.filter((p) => p.category === "Electronics");
    vi.mocked(prisma.product.findMany).mockResolvedValue(electronics as any);

    const result = await productRepository.getByCategory("Electronics");
    expect(result.length).toBe(electronics.length);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { category: "Electronics" },
      orderBy: { id: "asc" },
    });
  });

  it("should return unique sorted category list", async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([
      { category: "Books" },
      { category: "Clothing" },
      { category: "Electronics" },
      { category: "Home & Kitchen" },
    ] as any);

    const categories = await productRepository.getCategories();
    expect(categories).toEqual(["Books", "Clothing", "Electronics", "Home & Kitchen"]);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
  });

  it("should search products by query", async () => {
    const searchResults = [productsData[1]];
    vi.mocked(prisma.product.findMany).mockResolvedValue(searchResults as any);

    const resultsName = await productRepository.search("keyboard");
    expect(resultsName.length).toBe(1);
    expect(resultsName[0].name).toContain("Keyboard");
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "keyboard", mode: "insensitive" } },
          { description: { contains: "keyboard", mode: "insensitive" } },
        ],
      },
      orderBy: { id: "asc" },
    });
  });

  it("should return all products on empty search query", async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue(productsData as any);

    const results = await productRepository.search("");
    expect(results.length).toBe(12);
  });
});
