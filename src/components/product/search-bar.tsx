'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search by name or keyword...' }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
        <Search className="h-4 w-4" aria-hidden="true" />
      </div>
      <Input
        type="text"
        className="pl-10 pr-10 h-10 rounded-xl bg-card border-border/60 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-2xs transition-all placeholder:text-muted-foreground/70"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <div className="rounded-full bg-muted p-1 hover:bg-muted-foreground/20">
            <X className="h-3 w-3" />
          </div>
        </button>
      )}
    </div>
  );
}
