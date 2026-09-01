import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { productRepository } from '@/repositories/product.repository';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className={buttonVariants({ variant: 'ghost', className: 'mb-6' })}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-2 flex items-center space-x-2">
            <Badge variant="secondary">{product.category}</Badge>
            <div className="flex items-center text-sm text-yellow-500">
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
              <span className="ml-1 text-muted-foreground text-xs">({product.rating.toFixed(1)})</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
          <p className="text-2xl font-medium text-primary mb-6">{formatPrice(product.price)}</p>
          
          <div className="prose prose-sm sm:prose-base dark:prose-invert mb-8 text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <div className="mb-6">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <Separator className="mb-6" />

          <div className="mt-auto">
            <AddToCartButton product={product} size="lg" className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
