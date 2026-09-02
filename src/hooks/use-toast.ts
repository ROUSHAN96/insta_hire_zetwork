'use client';

import * as React from 'react';

export type ToastVariant = 'default' | 'success' | 'destructive' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (title: string, description?: string, duration?: number) => string;
  error: (title: string, description?: string, duration?: number) => string;
  info: (title: string, description?: string, duration?: number) => string;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
