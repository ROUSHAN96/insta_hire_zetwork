import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/repositories/order.repository';
import { checkoutFormSchema } from '@/types/order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const validationResult = checkoutFormSchema.safeParse({
      customer: body.customer,
      shippingAddress: body.shippingAddress,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { code: 'VALIDATION_ERROR', message: 'Invalid order data', details: validationResult.error.format() } 
        },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Order must contain at least one item' } },
        { status: 400 }
      );
    }

    if (typeof body.totalPrice !== 'number' || body.totalPrice < 0) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid total price' } },
        { status: 400 }
      );
    }

    const order = await orderRepository.create({
      items: body.items,
      customer: validationResult.data.customer,
      shippingAddress: validationResult.data.shippingAddress,
      totalPrice: body.totalPrice,
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
