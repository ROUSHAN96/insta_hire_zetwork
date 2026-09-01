import { Suspense } from 'react';
import { productRepository } from '@/repositories/product.repository';
import { ProductListing } from '@/components/product/product-listing';
import { FlashDealsBanner } from '@/components/product/flash-deals-banner';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Truck,
  RotateCcw,
  Headphones,
  Laptop,
  Shirt,
  BookOpen,
  Home,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    productRepository.getAll(),
    productRepository.getCategories(),
  ]);

  const departmentShowcase = [
    {
      name: 'Electronics & Audio',
      desc: 'Noise cancelling, wireless gear & accessories',
      href: '/?category=Electronics#products',
      icon: Laptop,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badge: 'Up to 35% OFF',
    },
    {
      name: 'Modern Apparel',
      desc: 'Premium cotton tees, hoodies & essentials',
      href: '/?category=Clothing#products',
      icon: Shirt,
      color: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      badge: 'New Season',
    },
    {
      name: 'Books & Learning',
      desc: 'Tech, development, science & design bestsellers',
      href: '/?category=Books#products',
      icon: BookOpen,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      badge: 'Best Sellers',
    },
    {
      name: 'Home & Kitchen',
      desc: 'Smart cookware, aesthetic mugs & daily tools',
      href: '/?category=Home%20%26%20Kitchen#products',
      icon: Home,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badge: 'Trending',
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* 1. Department Category Showcase Grid */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentShowcase.map((dept) => {
            const Icon = dept.icon;
            return (
              <Link
                key={dept.name}
                href={dept.href}
                className="group p-5 rounded-3xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-linear-to-br ${dept.color} border`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {dept.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{dept.name}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {dept.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Flash Deals of the Day Banner */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-8 pt-16">
        <FlashDealsBanner />
      </section>

      {/* 4. Main Catalog Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full Product Collection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Explore Our Storefront
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse top-rated electronics, fashion, literature, and home essentials with fast dispatch.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading products...</div>}>
          <ProductListing products={products} categories={categories} />
        </Suspense>
      </section>
    </div>
  );
}
