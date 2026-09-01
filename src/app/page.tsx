import { productRepository } from '@/repositories/product.repository';
import { ProductListing } from '@/components/product/product-listing';

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    productRepository.getAll(),
    productRepository.getCategories(),
  ]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Our Products</h1>
        <p className="mt-2 text-muted-foreground">Browse our curated collection of premium products</p>
      </div>
      <ProductListing products={products} categories={categories} />
    </div>
  );
}
