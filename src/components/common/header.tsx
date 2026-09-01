'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
  Search,
  Headphones,
  MapPin,
  ChevronDown,
  ArrowRight,
  Flame,
  Tag,
  Zap,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { CartIcon } from '@/components/cart/cart-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalWishlist } = useWishlist();
  const [tickerIndex, setTickerIndex] = useState(0);
  const [headerSearch, setHeaderSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const announcements = [
    '⚡ FLASH SALE: Up to 40% Off Premium Electronics & Apparel — Limited Time Only',
    '🚚 FREE Express Delivery on all orders over $50 + Instant 24h Dispatch',
    '🛡️ 100% Genuine Certified Products • 30-Day Money-Back Guarantee',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/?search=${encodeURIComponent(headerSearch.trim())}#products`);
    } else {
      router.push('/#products');
    }
    setIsMobileMenuOpen(false);
  };

  const categories = [
    { name: 'All Departments', href: '/?category=all#products', icon: Sparkles },
    { name: 'Flash Deals', href: '/#deals', icon: Flame, highlight: true },
    { name: 'Electronics', href: '/?category=Electronics#products', icon: Zap },
    { name: 'Clothing', href: '/?category=Clothing#products', icon: Tag },
    { name: 'Books', href: '/?category=Books#products', icon: null },
    { name: 'Home & Kitchen', href: '/?category=Home%20%26%20Kitchen#products', icon: null },
  ];

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* 1. Top Utility Micro-Bar */}
      <div className="bg-slate-900 text-slate-100 text-[11px] py-1.5 px-4 font-medium border-b border-slate-800">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          {/* Left: Location & Hotline */}
          <div className="hidden lg:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-emerald-400" /> Deliver to: <strong className="text-white">Global Express</strong>
            </span>
            <span className="opacity-30">|</span>
            <span className="flex items-center gap-1.5">
              <Headphones className="h-3 w-3 text-primary" /> 24/7 Helpline: <strong className="text-white">+1 (800) 938-SHOP</strong>
            </span>
          </div>

          {/* Center: Animated Promotional Ticker */}
          <div className="flex-1 text-center truncate px-2 font-medium text-emerald-300">
            <span className="animate-in fade-in duration-500 inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              {announcements[tickerIndex]}
            </span>
          </div>

          {/* Right: Guarantee and Currency */}
          <div className="hidden md:flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1 text-[10px] text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Verified Merchant
            </span>
            <span className="opacity-30">|</span>
            <span className="text-[10px] font-semibold text-white bg-slate-800 px-1.5 py-0.5 rounded">
              USD ($)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="w-full border-b border-border/50 glass-header shadow-xs">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform duration-200 active:scale-95 shrink-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-tr from-primary to-primary/80 text-primary-foreground font-black text-sm shadow-md ring-1 ring-border/20 group-hover:shadow-lg transition-all">
                SZ
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight leading-none text-foreground">
                  <span>{siteConfig.name}</span>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-bold uppercase tracking-wider h-4 bg-primary/10 text-primary border border-primary/20">
                    Pro
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium tracking-tight">
                  Premier Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Center Working Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search products, electronics, apparel..."
                className="w-full pl-10 pr-20 py-2 rounded-2xl bg-secondary/70 hover:bg-secondary focus:bg-background text-xs text-foreground placeholder:text-muted-foreground border border-border/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Link to Storefront */}
            <Link
              href="/#products"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-all border border-border/50"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Catalog</span>
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/?filter=wishlist#products"
              className="relative flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-muted/80 transition-colors cursor-pointer"
              title="Saved Items"
            >
              <Heart className={cn('h-4 w-4', totalWishlist > 0 && 'text-rose-500 fill-rose-500')} />
              {totalWishlist > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                  {totalWishlist}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-border/60 mx-0.5" />

            {/* Cart Icon with Live Count */}
            <CartIcon />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl hover:bg-muted"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* 3. Horizontal Category Navigation Strip (Desktop) */}
        <div className="hidden md:block border-t border-border/40 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className={cn(
                      'px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap',
                      cat.highlight
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20 hover:bg-rose-500/15'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    )}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-4 text-muted-foreground text-[11px] shrink-0 font-medium">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Truck className="h-3.5 w-3.5" /> Free Returns in 30 Days
              </span>
              <span className="opacity-40">•</span>
              <Link href="/cart" className="hover:text-foreground transition-colors">
                View Bag
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl p-5 shadow-xl animate-in slide-in-from-top-2 duration-200 space-y-4">
            {/* Mobile Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-20 py-2 rounded-xl bg-secondary text-xs text-foreground placeholder:text-muted-foreground border border-border focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
              >
                Search
              </button>
            </form>

            <nav className="flex flex-col gap-1.5">
              <Link
                href="/"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-foreground font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Home</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>

              <Link
                href="/#products"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Shop All Products</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>

              {/* Mobile Category Links */}
              <div className="py-2 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4">Categories</span>
                {categories.slice(1).map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="flex items-center justify-between px-4 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="h-3 w-3 opacity-40" />
                  </Link>
                ))}
              </div>

              <Link
                href="/cart"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Shopping Cart</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>

              <div className="pt-3 mt-2 border-t border-border/60 flex flex-col gap-2 text-xs text-muted-foreground px-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Truck className="h-3.5 w-3.5 text-primary" /> Free Express on $50+
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    100% Genuine
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground pt-1">
                  📞 24/7 Helpline: +1 (800) 938-SHOP
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
