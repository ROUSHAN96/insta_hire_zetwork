'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { ShieldCheck, Truck, RotateCcw, Clock, Mail, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="border-t border-border/50 bg-muted/40 text-foreground">
      {/* Value Proposition Strip */}
      <div className="border-b border-border/40 py-8 bg-background/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Free Express Shipping</h4>
                <p className="text-xs text-muted-foreground mt-0.5">On all orders above $50</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">30-Day Free Returns</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Hassle-free return policy</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">100% Genuine</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Directly sourced products</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">24/7 Dedicated Support</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Instant assistance anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-md">
                SZ
              </div>
              <span className="tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Your premier destination for high quality tech, stylish apparel, captivating books, and modern home essentials.
            </p>
            
            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Stay in the loop
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background rounded-lg text-sm h-9"
                  required
                />
                <Button type="submit" size="sm" className="h-9 px-3 shrink-0 rounded-lg">
                  {subscribed ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Joined
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Subscribe <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground">Explore</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Featured Products</Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-foreground transition-colors">Electronics</Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-foreground transition-colors">Clothing & Apparel</Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-foreground transition-colors">Home & Kitchen</Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-foreground transition-colors">Books & Media</Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground">Customer Care</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/cart" className="hover:text-foreground transition-colors">View Cart</Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-foreground transition-colors">Order Checkout</Link>
              </li>
              <li>
                <span className="text-muted-foreground/80 cursor-default">Shipping Information</span>
              </li>
              <li>
                <span className="text-muted-foreground/80 cursor-default">Returns & Refunds</span>
              </li>
              <li>
                <span className="text-muted-foreground/80 cursor-default">Help & FAQ</span>
              </li>
            </ul>
          </div>

          {/* Security & Guarantees */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground">Secure Shopping</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All transactions are encrypted with 256-bit SSL protocols. We respect your privacy and protect your personal data.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-background border border-border/60 text-muted-foreground">
                Visa / MC
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-background border border-border/60 text-muted-foreground">
                UPI / NetBanking
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-background border border-border/60 text-muted-foreground">
                Cash On Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            &copy; {new Date().getFullYear()} {siteConfig.name}, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
