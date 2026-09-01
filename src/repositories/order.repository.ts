import { prisma } from "@/lib/prisma";
import type { Order, CartItem, CustomerInfo, ShippingAddress } from "@/types";

export const orderRepository = {
  create: async (input: {
    items: CartItem[];
    customer: CustomerInfo;
    shippingAddress: ShippingAddress;
    totalPrice: number;
  }): Promise<Order> => {
    const created = await prisma.order.create({
      data: {
        customerName: input.customer.name,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        street: input.shippingAddress.street,
        city: input.shippingAddress.city,
        state: input.shippingAddress.state,
        zipCode: input.shippingAddress.zipCode,
        country: input.shippingAddress.country,
        totalPrice: input.totalPrice,
        status: "confirmed",
        items: {
          create: input.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      id: created.id,
      customer: {
        name: created.customerName,
        email: created.customerEmail,
        phone: created.customerPhone,
      },
      shippingAddress: {
        street: created.street,
        city: created.city,
        state: created.state,
        zipCode: created.zipCode,
        country: created.country,
      },
      totalPrice: created.totalPrice,
      status: created.status as Order["status"],
      createdAt: created.createdAt.toISOString(),
      items: created.items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          category: item.product.category,
          price: item.product.price,
          stock: item.product.stock,
          rating: item.product.rating,
          image: item.product.image,
          description: item.product.description,
        },
        quantity: item.quantity,
      })),
    };
  },

  getById: async (id: string): Promise<Order | null> => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) return null;

    return {
      id: order.id,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      shippingAddress: {
        street: order.street,
        city: order.city,
        state: order.state,
        zipCode: order.zipCode,
        country: order.country,
      },
      totalPrice: order.totalPrice,
      status: order.status as Order["status"],
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          category: item.product.category,
          price: item.product.price,
          stock: item.product.stock,
          rating: item.product.rating,
          image: item.product.image,
          description: item.product.description,
        },
        quantity: item.quantity,
      })),
    };
  },
};
