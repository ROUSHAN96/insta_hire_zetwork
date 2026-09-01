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
      {/* 1. Flagship Hero Banner */}
      <section className="relative overflow-hidden bg-radial from-secondary/80 via-background to-background border-b border-border/40 py-12 sm:py-20 lg:py-24">
        {/* Subtle Background Ambience */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/8 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-8 relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border/60 text-xs font-bold shadow-2xs">
              <span className="flex size-2 rounded-full bg-primary animate-pulse" />
              <span>THE 2026 FLAGSHIP COLLECTION</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-primary">FREE WORLDWIDE EXPRESS ON $50+</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08]">
              Next-Gen Products. <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
                Uncompromising Quality.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Explore meticulously curated electronics, premium everyday apparel, bestselling engineering books, and modern home essentials.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground font-bold px-8 py-4 text-sm shadow-xl hover:bg-primary/90 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#deals"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-card hover:bg-secondary text-foreground font-bold px-7 py-4 text-sm border border-border/60 shadow-xs transition-all hover:scale-103 active:scale-97"
              >
                <Zap className="h-4 w-4 text-amber-500" />
                <span>View Flash Deals</span>
              </a>
            </div>

            {/* Trust highlights strip */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full max-w-4xl">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/70 border border-border/40 text-left shadow-2xs">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-foreground">Free Express Dispatch</span>
                  <span className="text-[11px] text-muted-foreground">Orders over $50</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/70 border border-border/40 text-left shadow-2xs">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-foreground">100% Genuine</span>
                  <span className="text-[11px] text-muted-foreground">Certified authentic</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/70 border border-border/40 text-left shadow-2xs">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                  <RotateCcw className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-foreground">30-Day Free Return</span>
                  <span className="text-[11px] text-muted-foreground">Hassle-free guarantee</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/70 border border-border/40 text-left shadow-2xs">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-foreground">24/7 Support</span>
                  <span className="text-[11px] text-muted-foreground">Instant chat & call</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Department Category Showcase Grid */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-8 -mt-6 relative z-10">
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
