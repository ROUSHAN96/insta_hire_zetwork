import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/repositories/order.repository';
import { createOrderInputSchema } from '@/types/order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = createOrderInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid order data',
            details: validationResult.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { items, customer, shippingAddress, totalPrice } = validationResult.data;

    const order = await orderRepository.create({
      items,
      customer,
      shippingAddress,
      totalPrice,
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create order' } },
      { status: 500 }
    );
  }
}
