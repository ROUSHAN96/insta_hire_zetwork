import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { productRepository } from '@/repositories/product.repository';
import { buttonVariants } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { ProductDetailView } from '@/components/product/product-detail-view';

export async function generateStaticParams() {
  const products = await productRepository.getAll();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata(props: PageProps<'/products/[slug]'>) {
  const { slug } = await props.params;
  const product = await productRepository.getBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | ShopZet`,
    description: product.description,
  };
}

export default async function ProductDetailPage(props: PageProps<'/products/[slug]'>) {
  const { slug } = await props.params;
  const product = await productRepository.getBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category (excluding current product)
  const categoryProducts = await productRepository.getByCategory(product.category);
  const relatedProducts = categoryProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen pb-20">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/40 bg-muted/20 py-3.5">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <Link href="/#products" className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-8 pt-8">
        <Link
          href="/"
          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'mb-8 -ml-2 rounded-xl text-muted-foreground hover:text-foreground' })}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to all products
        </Link>

        {/* Rich Interactive Product Details */}
        <ProductDetailView product={product} />

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-border/50">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Recommendations</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-0.5">
                  Customers Also Viewed
                </h2>
              </div>
              <Link href="/#products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
