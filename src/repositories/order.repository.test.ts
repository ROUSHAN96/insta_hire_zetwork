import { describe, it, expect, vi, beforeEach } from "vitest";
import { orderRepository } from "./order.repository";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("OrderRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleProduct = {
    id: "prod_001",
    name: "Wireless Noise-Canceling Headphones",
    slug: "wireless-noise-canceling-headphones",
    description: "Sample description",
    price: 299900,
    image: "https://images.unsplash.com/photo-1",
    category: "Electronics",
    stock: 45,
    rating: 4.7,
  };

  const sampleOrderInput = {
    items: [{ product: sampleProduct, quantity: 2 }],
    customer: {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "5551234567",
    },
    shippingAddress: {
      street: "123 MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
    },
    totalPrice: 599800,
  };

  it("should create an order and retrieve it by ID", async () => {
    const mockDbOrder = {
      id: "ord_123",
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhone: "5551234567",
      street: "123 MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
      totalPrice: 599800,
      status: "confirmed",
      createdAt: new Date("2026-09-01T12:00:00.000Z"),
      updatedAt: new Date("2026-09-01T12:00:00.000Z"),
      items: [
        {
          id: "item_1",
          orderId: "ord_123",
          productId: "prod_001",
          quantity: 2,
          price: 299900,
          product: sampleProduct,
        },
      ],
    };

    vi.mocked(prisma.order.create).mockResolvedValue(mockDbOrder as any);
    vi.mocked(prisma.order.findUnique).mockResolvedValue(mockDbOrder as any);

    const newOrder = await orderRepository.create(sampleOrderInput);

    expect(newOrder.id).toBe("ord_123");
    expect(newOrder.status).toBe("confirmed");
    expect(newOrder.items.length).toBe(1);
    expect(newOrder.totalPrice).toBe(599800);
    expect(newOrder.customer.name).toBe("Jane Doe");
    expect(newOrder.createdAt).toBe("2026-09-01T12:00:00.000Z");

    const retrieved = await orderRepository.getById("ord_123");
    expect(retrieved).toEqual(newOrder);
  });

  it("should return null when looking up a non-existent order", async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue(null);

    const order = await orderRepository.getById("non_existent_order_id");
    expect(order).toBeNull();
  });
});
