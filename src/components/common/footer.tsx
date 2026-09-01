import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 py-12">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-8">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="font-bold text-lg flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold shadow-sm">
              SZ
            </span>
            {siteConfig.name}
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left max-w-xs">
            Your one-stop shop for everything. Quality products, fast delivery.
          </p>
        </div>
        
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
            Cart
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
