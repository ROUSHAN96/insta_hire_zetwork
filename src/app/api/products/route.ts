import { NextRequest, NextResponse } from 'next/server';
import { productRepository } from '@/repositories/product.repository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let products;

    if (search) {
      products = await productRepository.search(search);
    } else if (category && category !== 'All Categories') {
      products = await productRepository.getByCategory(category);
    } else {
      products = await productRepository.getAll();
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch products' } },
      { status: 500 }
    );
  }
}
