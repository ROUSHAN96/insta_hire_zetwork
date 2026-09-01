'use client';

import { Layers, Laptop, Shirt, BookOpen, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Electronics: Laptop,
  Clothing: Shirt,
  Books: BookOpen,
  'Home & Kitchen': Home,
};

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none',
            selected === null
              ? 'bg-primary text-primary-foreground shadow-sm scale-100 ring-2 ring-primary/20'
              : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/40 hover:scale-[1.02]'
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>All Items</span>
        </button>

        {categories.map((category) => {
          const Icon = categoryIcons[category] || Layers;
          const isSelected = selected === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm scale-100 ring-2 ring-primary/20'
                  : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/40 hover:scale-[1.02]'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
