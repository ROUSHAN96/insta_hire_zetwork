'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/types/product';
import { SearchBar } from './search-bar';
import { CategoryFilter } from './category-filter';
import { ProductCard } from './product-card';
import { EmptyState } from '@/components/feedback/empty-state';
import { useDebounce } from '@/hooks/use-debounce';
import {
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  Grid2X2,
  Check,
  Star,
  DollarSign,
  PackageCheck,
  Heart,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { useWishlist } from '@/hooks/use-wishlist';

interface ProductListingProps {
  products: Product[];
  categories: string[];
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';
type PriceFilter = 'all' | 'under-1000' | '1000-5000' | 'over-5000';

export function ProductListing({ products, categories }: ProductListingProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category');
  const initialSearch = searchParams?.get('search');
  const initialFilter = searchParams?.get('filter');

  const { isWishlisted, totalWishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory && initialCategory !== 'all' ? initialCategory : null
  );
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(initialFilter === 'wishlist');
  const [gridLayout, setGridLayout] = useState<'4-col' | '3-col'>('4-col');

  // Synchronize when URL searchParams change
  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory === 'all' || !initialCategory ? null : initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch || '');
    }
  }, [initialSearch]);

  useEffect(() => {
    if (initialFilter !== undefined) {
      setWishlistOnly(initialFilter === 'wishlist');
    }
  }, [initialFilter]);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredAndSortedProducts = useMemo(() => {
    const result = products.filter((product) => {
      // 1. Search Query
      const matchesSearch =
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearch.toLowerCase());

      // 2. Category
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;

      // 3. Price Filter (in paise / INR)
      let matchesPrice = true;
      if (priceFilter === 'under-1000') matchesPrice = product.price < 100000;
      else if (priceFilter === '1000-5000') matchesPrice = product.price >= 100000 && product.price <= 500000;
      else if (priceFilter === 'over-5000') matchesPrice = product.price > 500000;

      // 4. In-Stock Only
      const matchesStock = inStockOnly ? product.stock > 0 : true;

      // 5. Top-Rated Only (4.5+)
      const matchesRating = topRatedOnly ? product.rating >= 4.5 : true;

      // 6. Wishlist Only
      const matchesWishlist = wishlistOnly ? isWishlisted(product.id) : true;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesRating && matchesWishlist;
    });

    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return [...result].sort((a, b) => b.rating - a.rating);
      case 'featured':
      default:
        return result;
    }
  }, [products, debouncedSearch, selectedCategory, sortBy, priceFilter, inStockOnly, topRatedOnly, wishlistOnly, isWishlisted]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== null ||
    sortBy !== 'featured' ||
    priceFilter !== 'all' ||
    inStockOnly ||
    topRatedOnly ||
    wishlistOnly;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('featured');
    setPriceFilter('all');
    setInStockOnly(false);
    setTopRatedOnly(false);
    setWishlistOnly(false);
  };

  return (
    <div id="products" className="space-y-6">
      {/* Category Pills Strip */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Main Search & Advanced Control Panel */}
      <div className="bg-card rounded-3xl border border-border/50 p-5 shadow-xs space-y-4">
        {/* Search Bar + Sort & Layout row */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search 1,000+ products, electronics, apparel..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-secondary/80 rounded-2xl px-3.5 py-2 border border-border/50 text-xs shadow-2xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold text-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-foreground text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated (★)</option>
              </select>
            </div>

            {/* Layout switch buttons */}
            <div className="hidden sm:flex items-center bg-secondary/80 rounded-2xl p-1 border border-border/50">
              <button
                onClick={() => setGridLayout('4-col')}
                className={cn(
                  'p-1.5 rounded-xl transition-all cursor-pointer',
                  gridLayout === '4-col' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
                title="4-Column Grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridLayout('3-col')}
                className={cn(
                  'p-1.5 rounded-xl transition-all cursor-pointer',
                  gridLayout === '3-col' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
                title="3-Column Grid"
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <SlidersHorizontal className="h-3 w-3" /> Filter By:
            </span>

            {/* Price pills */}
            <div className="flex items-center bg-secondary/60 rounded-xl p-0.5 border border-border/40">
              {[
                { label: 'All Prices', value: 'all' },
                { label: '< ₹1,000', value: 'under-1000' },
                { label: '₹1,000 - ₹5,000', value: '1000-5000' },
                { label: '> ₹5,000', value: 'over-5000' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriceFilter(p.value as PriceFilter)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer',
                    priceFilter === p.value
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* In-Stock Toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={cn(
                'px-3 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5',
                inStockOnly
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-secondary/60 text-muted-foreground border-border/40 hover:text-foreground'
              )}
            >
              <PackageCheck className="h-3 w-3" />
              <span>In Stock Only</span>
              {inStockOnly && <Check className="h-3 w-3 ml-0.5" />}
            </button>

            {/* Top-Rated Toggle */}
            <button
              onClick={() => setTopRatedOnly(!topRatedOnly)}
              className={cn(
                'px-3 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5',
                topRatedOnly
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                  : 'bg-secondary/60 text-muted-foreground border-border/40 hover:text-foreground'
              )}
            >
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>4.5★ & Up</span>
              {topRatedOnly && <Check className="h-3 w-3 ml-0.5" />}
            </button>

            {/* Liked / Wishlist Toggle */}
            <button
              onClick={() => setWishlistOnly(!wishlistOnly)}
              className={cn(
                'px-3 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5',
                wishlistOnly
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                  : 'bg-secondary/60 text-muted-foreground border-border/40 hover:text-foreground'
              )}
            >
              <Heart className={cn('h-3 w-3', (wishlistOnly || totalWishlist > 0) && 'text-rose-500 fill-rose-500')} />
              <span>Liked ({totalWishlist})</span>
              {wishlistOnly && <Check className="h-3 w-3 ml-0.5" />}
            </button>
          </div>

          {/* Results count & Clear */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-[11px] font-semibold">
              Showing <strong className="text-foreground">{filteredAndSortedProducts.length}</strong> items
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Reset All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div
          className={cn(
            'grid gap-6',
            gridLayout === '3-col'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}
        >
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <EmptyState
            title="No matching products found"
            description={
              searchQuery
                ? `We couldn't find any products matching "${searchQuery}". Try loosening your filters or searching for another term.`
                : 'No items match your active filters. Try adjusting price range or availability.'
            }
            action={
              <Button
                variant="outline"
                size="lg"
                onClick={handleResetFilters}
                className="rounded-2xl mt-4 font-bold shadow-xs cursor-pointer"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset All Filters
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
