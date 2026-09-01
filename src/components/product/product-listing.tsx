'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/types/product';
import { SearchBar } from './search-bar';
import { CategoryFilter } from './category-filter';
import { ProductCard } from './product-card';
import { EmptyState } from '@/components/feedback/empty-state';
import { useDebounce } from '@/hooks/use-debounce';

interface ProductListingProps {
  products: Product[];
  categories: string[];
}

export function ProductListing({ products, categories }: ProductListingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                            product.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search products..." />
        <div className="text-sm text-muted-foreground font-medium">
          Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <CategoryFilter 
        categories={categories} 
        selected={selectedCategory} 
        onSelect={setSelectedCategory} 
      />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState 
            title="No products found" 
            description="We couldn't find any products matching your current filters."
          />
        </div>
      )}
    </div>
  );
}
