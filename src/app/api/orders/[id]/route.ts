import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/repositories/order.repository';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/orders/[id]'>) {
  try {
    const { id } = await ctx.params;
    const order = await orderRepository.getById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error(`Error fetching order:`, error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch order' } },
      { status: 500 }
    );
  }
}
