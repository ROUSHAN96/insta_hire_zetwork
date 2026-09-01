import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

export const productRepository = {
  getAll: async (): Promise<Product[]> => {
    return prisma.product.findMany({
      orderBy: { id: "asc" },
    });
  },

  getById: async (id: string): Promise<Product | null> => {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    return prisma.product.findUnique({
      where: { slug },
    });
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    return prisma.product.findMany({
      where: { category },
      orderBy: { id: "asc" },
    });
  },

  getCategories: async (): Promise<string[]> => {
    const results = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return results.map((r) => r.category);
  },

  search: async (query: string): Promise<Product[]> => {
    if (!query || query.trim() === "") {
      return prisma.product.findMany({
        orderBy: { id: "asc" },
      });
    }

    return prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "asc" },
    });
  },
};
