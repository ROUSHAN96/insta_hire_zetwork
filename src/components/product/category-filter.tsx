'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex space-x-2">
        <button
          onClick={() => onSelect(null)}
          className="focus:outline-none"
        >
          <Badge
            variant={selected === null ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer whitespace-nowrap text-sm px-4 py-1.5 transition-colors',
              selected === null ? '' : 'hover:bg-muted'
            )}
          >
            All
          </Badge>
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className="focus:outline-none"
          >
            <Badge
              variant={selected === category ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer whitespace-nowrap text-sm px-4 py-1.5 transition-colors',
                selected === category ? '' : 'hover:bg-muted'
              )}
            >
              {category}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
