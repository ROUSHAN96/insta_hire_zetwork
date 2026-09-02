'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext, type ToastItem, type ToastVariant } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...toast, id };
      const duration = toast.duration ?? 5000;

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = React.useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, variant: 'success', duration });
    },
    [addToast]
  );

  const error = React.useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, variant: 'destructive', duration });
    },
    [addToast]
  );

  const info = React.useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, variant: 'info', duration });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info }}>
      {children}
      {/* Toast Viewport */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 pointer-events-none sm:bottom-6 sm:right-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-xl transition-all duration-300',
              'animate-in slide-in-from-bottom-5 fade-in-0',
              t.variant === 'success' &&
                'border-emerald-500/30 bg-card/95 text-foreground dark:border-emerald-500/40 dark:bg-card/95 ring-1 ring-emerald-500/20',
              t.variant === 'destructive' &&
                'border-destructive/40 bg-card/95 text-foreground ring-1 ring-destructive/20',
              t.variant === 'info' &&
                'border-primary/30 bg-card/95 text-foreground ring-1 ring-primary/20',
              (!t.variant || t.variant === 'default') && 'border-border bg-card/95 text-foreground'
            )}
          >
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">
              {t.variant === 'success' && (
                <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 stroke-[2.5]" />
                </div>
              )}
              {t.variant === 'destructive' && (
                <div className="flex size-6 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                  <AlertCircle className="size-4 stroke-[2.5]" />
                </div>
              )}
              {t.variant === 'info' && (
                <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Info className="size-4 stroke-[2.5]" />
                </div>
              )}
              {(!t.variant || t.variant === 'default') && (
                <div className="flex size-6 items-center justify-center rounded-full bg-muted text-foreground">
                  <Info className="size-4" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-bold leading-none tracking-tight text-foreground">{t.title}</p>
              {t.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              aria-label="Close notification"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
