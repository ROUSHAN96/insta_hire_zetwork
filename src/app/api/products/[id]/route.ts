import { NextRequest, NextResponse } from 'next/server';
import { productRepository } from '@/repositories/product.repository';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/products/[id]'>) {
  try {
    const { id } = await ctx.params;
    const product = await productRepository.getById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error(`Error fetching product:`, error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch product' } },
      { status: 500 }
    );
  }
}
