'use client';

import { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function FlashDealsBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 34,
    seconds: 42,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUnit = (n: number) => n.toString().padStart(2, '0');

  return (
    <div id="deals" className="mb-12 rounded-3xl overflow-hidden bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 text-white p-6 sm:p-8 shadow-xl relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30">
              <Flame className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
              FLASH DEALS OF THE DAY
            </span>
            <span className="text-xs text-indigo-200/70 hidden sm:inline">• Limited Stock</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Save Up To <span className="text-emerald-400">40% Off</span> Top Picks
          </h3>

          <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
            Grab our highest-rated tech accessories, apparel, and lifestyle gear at special discounted rates before time runs out.
          </p>
        </div>

        {/* Right: Live Countdown Timer & CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center justify-center size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-lg font-black font-mono leading-none">{formatUnit(timeLeft.hours)}</span>
              <span className="text-[10px] text-indigo-200 uppercase font-semibold mt-0.5">Hours</span>
            </div>
            <span className="text-xl font-bold text-indigo-300">:</span>
            <div className="flex flex-col items-center justify-center size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-lg font-black font-mono leading-none">{formatUnit(timeLeft.minutes)}</span>
              <span className="text-[10px] text-indigo-200 uppercase font-semibold mt-0.5">Mins</span>
            </div>
            <span className="text-xl font-bold text-indigo-300">:</span>
            <div className="flex flex-col items-center justify-center size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-lg font-black font-mono text-emerald-400 leading-none">{formatUnit(timeLeft.seconds)}</span>
              <span className="text-[10px] text-indigo-200 uppercase font-semibold mt-0.5">Secs</span>
            </div>
          </div>

          <Link
            href="/#products"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-md shrink-0"
          >
            <span>Claim Deals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
